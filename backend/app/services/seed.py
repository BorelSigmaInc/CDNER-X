from sqlalchemy.orm import Session
from ..models.database import User, Partner, CatalogOffer
from ..api.auth import hash_password

# Hardware subscriptions sourced from https://cdner-262908.vercel.app/
# retail_usd is CDNER suggested retail; monthly_usd is managed subscription (HaaS + bonding).
HARDWARE = [
    {
        "email": "vendor.access@cdner.test",
        "company": "CDNER Access",
        "region": "eu-central",
        "specialty": "edge-and-wifi",
        "offers": [
            {
                "sku": "CDNER-AIR-BELITE",
                "name": "CDNER Air be lite",
                "family": "air",
                "category": "wireless",
                "plan": "starter",
                "retail_usd": 79,
                "monthly_usd": 19,
                "setup_usd": 0,
                "upgrade_sku": "CDNER-AIR-AX3",
                "specs": "Wi-Fi 7 · BE3600 · 2.5G + 1G · USB-C · CDNER OS",
                "description": "Most affordable professional Wi-Fi 7 router and AP. USB-C power, Multi-Link Operation.",
            },
            {
                "sku": "CDNER-EDGE-S",
                "name": "CDNER Edge S (2025)",
                "family": "edge",
                "category": "router",
                "plan": "standard",
                "retail_usd": 99,
                "monthly_usd": 24,
                "setup_usd": 25,
                "upgrade_sku": "CDNER-CORE-804",
                "specs": "2.5G SFP · 5×1G bonding · PoE-In/Out · USB 3 · dual-core ARM · 512 MB",
                "description": "Compact wired router for homes, offices, and labs. Gigabit bonding and PoE out.",
            },
            {
                "sku": "CDNER-AIR-AX3",
                "name": "CDNER Air ax³",
                "family": "air",
                "category": "wireless",
                "plan": "plus",
                "retail_usd": 149,
                "monthly_usd": 32,
                "setup_usd": 25,
                "upgrade_sku": "CDNER-AIR-MEDIA",
                "specs": "802.11ax Wave 2 · 2.5G PoE · 4×1G · WPA3 · USB 3",
                "description": "Top-of-the-line AX home access point with Gen 6 wireless and 2.5 Gigabit Ethernet.",
            },
            {
                "sku": "CDNER-AIR-MEDIA",
                "name": "CDNER Air Media",
                "family": "air",
                "category": "wireless",
                "plan": "plus",
                "retail_usd": 179,
                "monthly_usd": 39,
                "setup_usd": 35,
                "upgrade_sku": "CDNER-DATA-SERVER",
                "specs": "Wi-Fi 7 hybrid · media/automation hub · containers",
                "description": "Wi-Fi 7 hybrid media and automation centre. Jellyfin, DLNA, SMB, and container apps.",
            },
        ],
    },
    {
        "email": "vendor.core@cdner.test",
        "company": "CDNER Core Fabric",
        "region": "us-east",
        "specialty": "switching",
        "offers": [
            {
                "sku": "CDNER-CORE-804",
                "name": "CDNER Core 804",
                "family": "core",
                "category": "switch",
                "plan": "enterprise",
                "retail_usd": 1290,
                "monthly_usd": 99,
                "setup_usd": 150,
                "upgrade_sku": "CDNER-CORE-812",
                "specs": "Compact 400G · AI clusters · storage fabric",
                "description": "Compact 400G switch for AI clusters, storage fabrics, and high-speed aggregation.",
            },
            {
                "sku": "CDNER-CORE-812",
                "name": "CDNER Core 812",
                "family": "core",
                "category": "switch",
                "plan": "enterprise",
                "retail_usd": 2890,
                "monthly_usd": 189,
                "setup_usd": 250,
                "upgrade_sku": "CDNER-DATA-SERVER",
                "specs": "2×400G QSFP56-DD · 2×200G · 8×50G SFP56 · quad-core 2 GHz · redundant PSU",
                "description": "Rack switch for 50G/200G/400G. Dual-redundant power and hot-swap fans.",
            },
        ],
    },
    {
        "email": "vendor.field@cdner.test",
        "company": "CDNER Field & Compute",
        "region": "uk-south",
        "specialty": "5g-and-storage",
        "offers": [
            {
                "sku": "CDNER-LAMP-5G",
                "name": "CDNER Lamp 5G R16",
                "family": "lte",
                "category": "5g",
                "plan": "plus",
                "retail_usd": 349,
                "monthly_usd": 49,
                "setup_usd": 40,
                "upgrade_sku": None,
                "specs": "Omni 5G · eSIM · IP67 · PoE · LTE Cat20 · MIMO 4×4 · GPS",
                "description": "Outdoor omnidirectional 5G with eSIM. Urban backup, ports, and industrial sites.",
            },
            {
                "sku": "CDNER-DATA-SERVER",
                "name": "CDNER Data Server",
                "family": "compute",
                "category": "storage",
                "plan": "enterprise",
                "retail_usd": 8900,
                "monthly_usd": 449,
                "setup_usd": 600,
                "upgrade_sku": None,
                "specs": "20× U.2 NVMe · 100G · 16-core 2 GHz · 32 GB DDR4 · ROSE OS · containers",
                "description": "Enterprise storage, 100G networking, and container platform. Dual hot-swap PSU.",
            },
        ],
    },
]


def seed_marketplace(db: Session) -> None:
    """Insert or refresh CDNER hardware SKUs from the public product line."""
    for spec in HARDWARE:
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
        else:
            partner.company = spec["company"]
            partner.specialty = spec["specialty"]
        for offer in spec["offers"]:
            row = db.query(CatalogOffer).filter(CatalogOffer.sku == offer["sku"]).first()
            fields = {k: v for k, v in offer.items()}
            if row:
                for key, value in fields.items():
                    setattr(row, key, value)
                row.partner_id = partner.id
            else:
                db.add(CatalogOffer(partner_id=partner.id, **fields))
    db.commit()
