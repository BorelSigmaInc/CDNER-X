from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import Optional, List
import json

from ..core.database import get_db
from ..core.fx import convert, detect_currency
from ..models.database import (
    User,
    Partner,
    CatalogOffer,
    Estimate,
    ServiceOrder,
    SupportTicket,
)

router = APIRouter(prefix="/api/marketplace", tags=["marketplace"])

REGIONS = ["eu-central", "uk-south", "us-east", "ap-southeast"]
PLANS = [
    {"id": "starter", "label": "Starter hardware", "paths": 1, "multiplier": 1.0},
    {"id": "standard", "label": "Standard + path bonding", "paths": 3, "multiplier": 1.15},
    {"id": "plus", "label": "Plus + 5G/QKD overlay", "paths": 3, "multiplier": 1.35},
    {"id": "enterprise", "label": "Enterprise fabric", "paths": 6, "multiplier": 1.6},
]
TERM_BREAKS = [(36, 0.20), (24, 0.12), (12, 0.05), (3, 0.02)]


def _term_discount(months: int) -> float:
    for threshold, pct in TERM_BREAKS:
        if months >= threshold:
            return pct
    return 0.0


def _volume_discount(qty: int) -> float:
    if qty >= 5:
        return 0.12
    if qty >= 3:
        return 0.08
    if qty >= 2:
        return 0.04
    return 0.0


def _currency(request: Request, explicit: Optional[str] = None, tz: Optional[str] = None) -> str:
    return detect_currency(
        explicit=explicit,
        country=request.headers.get("cf-ipcountry") or request.headers.get("x-vercel-ip-country"),
        language=request.headers.get("accept-language"),
        tz=tz,
    )


def _hardware_offers(db: Session):
    return (
        db.query(CatalogOffer)
        .filter(CatalogOffer.sku.like("CDNER-%"))
        .order_by(CatalogOffer.monthly_usd)
        .all()
    )


def _offer_payload(offer: CatalogOffer, partner: Optional[Partner], currency: str) -> dict:
    return {
        "id": offer.id,
        "sku": offer.sku,
        "name": offer.name,
        "category": offer.category,
        "family": offer.family,
        "plan": offer.plan,
        "specs": offer.specs,
        "description": offer.description,
        "upgrade_sku": offer.upgrade_sku,
        "monthly_usd": offer.monthly_usd,
        "setup_usd": offer.setup_usd,
        "retail_usd": offer.retail_usd,
        "monthly": convert(offer.monthly_usd or 0, currency),
        "setup": convert(offer.setup_usd or 0, currency),
        "retail": convert(offer.retail_usd or 0, currency),
        "partner_id": offer.partner_id,
        "partner": partner.company if partner else None,
        "region": partner.region if partner else None,
    }


@router.get("/fx")
async def fx_meta(
    request: Request,
    currency: Optional[str] = Query(None),
    tz: Optional[str] = Query(None),
):
    code = _currency(request, currency, tz)
    sample = convert(1.0, code)
    return {
        "currency": code,
        "usd_rate": sample["rate"],
        "symbol": sample["symbol"],
        "one_usd": sample,
        "source": "location",
    }


@router.get("/catalog")
async def catalog(
    request: Request,
    currency: Optional[str] = Query(None),
    tz: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    code = _currency(request, currency, tz)
    offers = _hardware_offers(db)
    partners = {p.id: p for p in db.query(Partner).all()}
    return {
        "currency": code,
        "items": [_offer_payload(o, partners.get(o.partner_id), code) for o in offers],
        "upgrades": {o.sku: o.upgrade_sku for o in offers if o.upgrade_sku},
        "discounts": {
            "term": [{"months": m, "percent": int(p * 100)} for m, p in reversed(TERM_BREAKS)],
            "volume": [{"qty": 2, "percent": 4}, {"qty": 3, "percent": 8}, {"qty": 5, "percent": 12}],
            "upgrade_credit_percent": 30,
        },
    }


@router.get("/meta")
async def meta(request: Request, currency: Optional[str] = Query(None), tz: Optional[str] = Query(None)):
    code = _currency(request, currency, tz)
    return {
        "regions": REGIONS,
        "plans": PLANS,
        "currency": code,
        "fx": convert(1.0, code),
    }


class EstimateItem(BaseModel):
    sku: str
    quantity: int = Field(ge=1, le=50)


class EstimateRequest(BaseModel):
    user_id: int
    region: str
    term_months: int = Field(default=12, ge=1, le=36)
    items: List[EstimateItem]
    currency: Optional[str] = None
    tz: Optional[str] = None
    from_sku: Optional[str] = None


@router.post("/estimate")
async def create_estimate(request: EstimateRequest, http: Request, db: Session = Depends(get_db)):
    if request.region not in REGIONS:
        raise HTTPException(status_code=400, detail="Unknown region")
    currency = _currency(http, request.currency, request.tz)
    offers = {o.sku: o for o in _hardware_offers(db)}
    lines = []
    monthly = 0.0
    setup = 0.0
    qty_total = 0
    for item in request.items:
        offer = offers.get(item.sku)
        if not offer:
            raise HTTPException(status_code=400, detail=f"Unknown SKU {item.sku}")
        line_monthly = offer.monthly_usd * item.quantity
        line_setup = offer.setup_usd * item.quantity
        monthly += line_monthly
        setup += line_setup
        qty_total += item.quantity
        lines.append({
            "sku": offer.sku,
            "name": offer.name,
            "quantity": item.quantity,
            "monthly_usd": line_monthly,
            "setup_usd": line_setup,
            "upgrade_sku": offer.upgrade_sku,
            "partner_id": offer.partner_id,
        })
    term_pct = _term_discount(request.term_months)
    vol_pct = _volume_discount(qty_total)
    net_monthly = round(monthly * (1 - term_pct) * (1 - vol_pct), 2)
    upgrade_credit = 0.0
    if request.from_sku and request.from_sku in offers:
        source = offers[request.from_sku]
        if any(line["sku"] == source.upgrade_sku for line in lines):
            upgrade_credit = round(source.monthly_usd * 0.30 * min(request.term_months, 12), 2)
    contract = round(net_monthly * request.term_months + setup - upgrade_credit, 2)
    record = Estimate(
        user_id=request.user_id,
        region=request.region,
        term_months=request.term_months,
        items_json=json.dumps(lines),
        monthly_usd=net_monthly,
        setup_usd=setup,
        status="priced",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {
        "estimate_id": record.id,
        "region": record.region,
        "term_months": request.term_months,
        "items": lines,
        "currency": currency,
        "list_monthly": convert(monthly, currency),
        "monthly": convert(net_monthly, currency),
        "setup": convert(setup, currency),
        "contract": convert(contract, currency),
        "upgrade_credit": convert(upgrade_credit, currency),
        "discounts_applied": {
            "term_percent": int(term_pct * 100),
            "volume_percent": int(vol_pct * 100),
            "upgrade_credit_usd": upgrade_credit,
        },
        "status": record.status,
    }


class OrderRequest(BaseModel):
    user_id: int
    sku: str
    service_name: str
    region: str
    plan: str = "standard"


@router.post("/orders")
async def place_order(request: OrderRequest, db: Session = Depends(get_db)):
    offer = db.query(CatalogOffer).filter(CatalogOffer.sku == request.sku).first()
    if not offer:
        raise HTTPException(status_code=400, detail="Unknown SKU")
    plan = next((p for p in PLANS if p["id"] == request.plan), PLANS[0])
    monthly = round(offer.monthly_usd * plan["multiplier"], 2)
    order = ServiceOrder(
        user_id=request.user_id,
        partner_id=offer.partner_id,
        offer_id=offer.id,
        service_name=request.service_name,
        region=request.region,
        plan=request.plan,
        monthly_usd=monthly,
        status="provisioning",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return {
        "order_id": order.id,
        "status": order.status,
        "monthly_usd": order.monthly_usd,
        "service_name": order.service_name,
        "region": order.region,
        "plan": order.plan,
        "partner_id": order.partner_id,
        "message": "Hardware subscription recorded. Partner will ship and bond the CDNER machine.",
    }


class UpgradeRequest(BaseModel):
    user_id: int
    order_id: int
    term_months: int = 12


@router.post("/upgrade")
async def upgrade_order(request: UpgradeRequest, http: Request, db: Session = Depends(get_db)):
    order = db.query(ServiceOrder).filter(ServiceOrder.id == request.order_id, ServiceOrder.user_id == request.user_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    current = db.query(CatalogOffer).filter(CatalogOffer.id == order.offer_id).first()
    if not current or not current.upgrade_sku:
        raise HTTPException(status_code=400, detail="This machine has no clever upgrade path")
    nxt = db.query(CatalogOffer).filter(CatalogOffer.sku == current.upgrade_sku).first()
    if not nxt:
        raise HTTPException(status_code=400, detail="Upgrade SKU missing")
    credit = round((current.monthly_usd or 0) * 0.30 * min(request.term_months, 12), 2)
    order.offer_id = nxt.id
    order.service_name = nxt.name
    order.monthly_usd = nxt.monthly_usd
    order.plan = nxt.plan
    order.status = "provisioning"
    db.commit()
    db.refresh(order)
    currency = _currency(http)
    return {
        "order_id": order.id,
        "from_sku": current.sku,
        "to_sku": nxt.sku,
        "to_name": nxt.name,
        "monthly": convert(nxt.monthly_usd or 0, currency),
        "upgrade_credit": convert(credit, currency),
        "message": f"Upgraded {current.name} → {nxt.name} with 30% residual credit.",
    }


@router.get("/orders")
async def list_orders(
    user_id: Optional[int] = Query(None),
    partner_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(ServiceOrder).order_by(ServiceOrder.id.desc())
    if user_id is not None:
        query = query.filter(ServiceOrder.user_id == user_id)
    if partner_id is not None:
        query = query.filter(ServiceOrder.partner_id == partner_id)
    rows = query.limit(50).all()
    return [
        {
            "id": row.id,
            "user_id": row.user_id,
            "partner_id": row.partner_id,
            "offer_id": row.offer_id,
            "service_name": row.service_name,
            "region": row.region,
            "plan": row.plan,
            "monthly_usd": row.monthly_usd,
            "status": row.status,
            "created_at": row.created_at.isoformat() if row.created_at else None,
        }
        for row in rows
    ]


class TicketRequest(BaseModel):
    user_id: int
    order_id: int
    title: str
    severity: str = "medium"


@router.post("/tickets")
async def open_ticket(request: TicketRequest, db: Session = Depends(get_db)):
    order = db.query(ServiceOrder).filter(ServiceOrder.id == request.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    ticket = SupportTicket(
        order_id=order.id,
        partner_id=order.partner_id,
        user_id=request.user_id,
        title=request.title,
        severity=request.severity,
        status="open",
    )
    order.status = "on_call"
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return {"ticket_id": ticket.id, "status": ticket.status, "severity": ticket.severity}


@router.get("/tickets")
async def list_tickets(
    partner_id: Optional[int] = Query(None),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(SupportTicket).order_by(SupportTicket.id.desc())
    if partner_id is not None:
        query = query.filter(SupportTicket.partner_id == partner_id)
    if user_id is not None:
        query = query.filter(SupportTicket.user_id == user_id)
    rows = query.limit(50).all()
    return [
        {
            "id": row.id,
            "order_id": row.order_id,
            "partner_id": row.partner_id,
            "user_id": row.user_id,
            "title": row.title,
            "severity": row.severity,
            "status": row.status,
            "created_at": row.created_at.isoformat() if row.created_at else None,
        }
        for row in rows
    ]


@router.get("/partners/dashboard")
async def partner_dashboard(partner_id: int, db: Session = Depends(get_db)):
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    orders = db.query(ServiceOrder).filter(ServiceOrder.partner_id == partner_id).all()
    tickets = db.query(SupportTicket).filter(SupportTicket.partner_id == partner_id).all()
    sales = sum(o.monthly_usd or 0 for o in orders if o.status in ("active", "provisioning", "on_call"))
    return {
        "partner": {
            "id": partner.id,
            "company": partner.company,
            "region": partner.region,
            "specialty": partner.specialty,
            "status": partner.status,
        },
        "kpis": {
            "monthly_sales_usd": round(sales, 2),
            "active_services": len([o for o in orders if o.status == "active"]),
            "provisioning": len([o for o in orders if o.status == "provisioning"]),
            "open_on_call": len([t for t in tickets if t.status == "open"]),
        },
        "orders": [
            {
                "id": o.id,
                "service_name": o.service_name,
                "user_id": o.user_id,
                "region": o.region,
                "plan": o.plan,
                "monthly_usd": o.monthly_usd,
                "status": o.status,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in orders
        ],
        "tickets": [
            {
                "id": t.id,
                "title": t.title,
                "severity": t.severity,
                "status": t.status,
                "order_id": t.order_id,
                "created_at": t.created_at.isoformat() if t.created_at else None,
            }
            for t in tickets
        ],
    }


class ProvisionRequest(BaseModel):
    partner_id: int
    user_email: str
    service_name: str
    sku: str
    region: str
    plan: str = "standard"


@router.post("/partners/provision")
async def provision_for_customer(request: ProvisionRequest, db: Session = Depends(get_db)):
    partner = db.query(Partner).filter(Partner.id == request.partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    customer = db.query(User).filter(User.email == request.user_email).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer CDNER-X ID not found")
    offer = db.query(CatalogOffer).filter(CatalogOffer.sku == request.sku).first()
    if not offer:
        raise HTTPException(status_code=400, detail="Unknown SKU")
    plan = next((p for p in PLANS if p["id"] == request.plan), PLANS[0])
    order = ServiceOrder(
        user_id=customer.id,
        partner_id=partner.id,
        offer_id=offer.id,
        service_name=request.service_name,
        region=request.region,
        plan=request.plan,
        monthly_usd=round(offer.monthly_usd * plan["multiplier"], 2),
        status="active",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return {
        "order_id": order.id,
        "status": order.status,
        "customer_id": customer.id,
        "monthly_usd": order.monthly_usd,
        "message": f"Provisioned {request.service_name} on {request.region} for {customer.email}",
    }


@router.get("/partners")
async def list_partners(db: Session = Depends(get_db)):
    rows = db.query(Partner).order_by(Partner.id).all()
    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "company": p.company,
            "region": p.region,
            "specialty": p.specialty,
            "status": p.status,
        }
        for p in rows
    ]
