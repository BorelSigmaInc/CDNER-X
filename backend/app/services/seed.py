from sqlalchemy.orm import Session
from ..models.database import User, Partner, CatalogOffer
from ..api.auth import hash_password


SEED_PARTNERS = [
    {
        "email": "vendor.alpine@cdner-x.test",
        "company": "Alpine Path Networks",
        "region": "eu-central",
        "specialty": "multi-path bonding",
        "offers": [
            {
                "sku": "CDX-BOND-STD",
                "name": "Bonded Access Standard",
                "category": "bonding",
                "plan": "standard",
                "monthly_usd": 2400,
                "setup_usd": 450,
                "description": "Starlink + 5G + Fiber round-robin with 15 ms class latency.",
            },
            {
                "sku": "CDX-BOND-ENT",
                "name": "Bonded Access Enterprise",
                "category": "bonding",
                "plan": "enterprise",
                "monthly_usd": 8900,
                "setup_usd": 1800,
                "description": "Multi-site bonded fabric with operator console and SLA tickets.",
            },
        ],
    },
    {
        "email": "vendor.glacier@cdner-x.test",
        "company": "Glacier QKD Labs",
        "region": "uk-south",
        "specialty": "qkd",
        "offers": [
            {
                "sku": "CDX-QKD-BB84",
                "name": "BB84 Session Protection",
                "category": "qkd",
                "plan": "plus",
                "monthly_usd": 600,
                "setup_usd": 120,
                "description": "Sifted BB84 keys for each bonded session. Raw key stays off the customer screen.",
            }
        ],
    },
    {
        "email": "vendor.yosemite@cdner-x.test",
        "company": "Yosemite Quantum Paths",
        "region": "us-east",
        "specialty": "quantum-optimization",
        "offers": [
            {
                "sku": "CDX-QPATH-OPT",
                "name": "Quantum Path Optimization",
                "category": "quantum",
                "plan": "standard",
                "monthly_usd": 450,
                "setup_usd": 0,
                "description": "Bell-state sampling to recommend Starlink, 5G, or Fiber egress.",
            }
        ],
    },
]


def seed_marketplace(db: Session) -> None:
    if db.query(CatalogOffer).count() > 0:
        return
    for spec in SEED_PARTNERS:
        user = db.query(User).filter(User.email == spec["email"]).first()
        if not user:
            user = User(
                email=spec["email"],
                hashed_password=hash_password("ChangeMe#31"),
                is_active=True,
                role="partner",
            )
            db.add(user)
            db.flush()
        else:
            user.role = "partner"
        partner = db.query(Partner).filter(Partner.user_id == user.id).first()
        if not partner:
            partner = Partner(
                user_id=user.id,
                company=spec["company"],
                region=spec["region"],
                specialty=spec["specialty"],
                status="active",
            )
            db.add(partner)
            db.flush()
        for offer in spec["offers"]:
            existing = db.query(CatalogOffer).filter(CatalogOffer.sku == offer["sku"]).first()
            if existing:
                continue
            db.add(CatalogOffer(partner_id=partner.id, **offer))
    db.commit()
