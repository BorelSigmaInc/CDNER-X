export type CatalogProduct = {
  slug: string
  name: string
  sku?: string
  monthlyUsd?: number
  upgradeSku?: string | null
  srpUsd?: number
  isNew?: boolean
  groups: string[]
  tags: string[]
  description: string
  image?: string
  heroSpecs?: string[]
}

export type CatalogGroup = { slug: string; title: string; blurb: string; products: string[] }

export type CatalogArticle = {
  path: string
  title: string
  lede?: string
  paragraphs?: string[]
  sections?: { title: string; body: string; href?: string }[]
}

export const PRODUCTS: CatalogProduct[] = [
  {
    slug: 'hex_s_2025',
    name: 'CDNER Edge S (2025)',
    sku: 'CDNER-EDGE-S',
    monthlyUsd: 24,
    upgradeSku: 'CDNER-CORE-804',
    srpUsd: 99,
    isNew: true,
    groups: ['new', 'ethernet-routers'],
    tags: ['2.5G', 'PoE', 'USB', 'ARM', 'OS v7'],
    image: '/cdner-media/rb_images/2483_lg.png',
    heroSpecs: [
      '2.5G SFP uplink',
      '5 x 1G ethernet (bonding support)',
      'PoE-In & PoE-Out',
      'USB 3 port for storage & file sharing',
      'Dual-Core ARM CPU + 512 MB RAM',
      'Flexible powering (12–57 V)',
    ],
    description:
      'A compact, affordable wired router featuring a 2.5G SFP port, 5x Gigabit Ethernet, PoE out, USB, and a fast dual-core CPU — ideal for homes, offices, or underfunded labs that need reliable performance.',
  },
  {
    slug: 'hap_ax3',
    name: 'CDNER Air ax³',
    sku: 'CDNER-AIR-AX3',
    monthlyUsd: 32,
    upgradeSku: 'CDNER-AIR-MEDIA',
    srpUsd: 139,
    groups: ['ethernet-routers', 'indoor-wireless'],
    tags: ['2.5G', 'PoE', 'WiFi 6', 'Dual-band', 'USB', 'ARM'],
    image: '/cdner-media/rb_images/2211_lg.png',
    heroSpecs: [
      '2.5G ethernet PoE-In/Out',
      '4 x 1G ethernet',
      '802.11ax + Wave 2',
      'Strong Dual-Band, Dual-Chain wireless',
      'USB 3 port for storage & file sharing',
    ],
    description:
      'Our top-of-the-line AX home access point. With all the processing power and speed your household might ever need. Gen 6 wireless, 2.5 Gigabit Ethernet, PoE, WPA3, and more!',
  },
  {
    slug: 'rds',
    name: 'CDNER Data Server',
    sku: 'CDNER-DATA-SERVER',
    monthlyUsd: 449,
    upgradeSku: null,
    srpUsd: 2495,
    isNew: true,
    groups: ['new', 'ethernet-routers'],
    tags: ['100G', 'NVMe', 'ARM64', 'OS v7'],
    image: '/cdner-media/rb_images/2438_lg.png',
    heroSpecs: [
      "20 x U.2 NVMe's",
      '100G high-speed networking',
      '16-core 2 GHz ARM CPU',
      '32GB DDR4 RAM',
      'ROSE (CDNER OS Edition)',
      'Container-ready',
      'Dual hot-swappable power supplies',
    ],
    description:
      'RDS is a high-performance, all-in-one storage, 100G networking, and container platform designed for enterprise environments. Featuring 20 U.2 NVMe storage slots and a special CDNER OS Edition for Storage & Compute (ROSE).',
  },
  {
    slug: 'crs812_ddq',
    name: 'CDNER Core 812',
    sku: 'CDNER-CORE-812',
    monthlyUsd: 189,
    upgradeSku: 'CDNER-DATA-SERVER',
    srpUsd: 1595,
    isNew: true,
    groups: ['new', 'switches'],
    tags: ['400G', '200G', '50G', 'ARM'],
    image: '/cdner-media/rb_images/2458_lg.png',
    heroSpecs: [
      '2 x 400G QSFP56-DD, 2 x 200G QSFP56',
      '8 x 50G SFP56',
      '1G/10G Ethernet ports',
      '4 GB of RAM',
      'Quad-core 2 GHz ARM CPU',
      'Dual-redundant hot-swap power supplies',
      '4 x hot-swap cooling fans',
    ],
    description:
      'This switch is your next leap forward – a powerful, efficient, and cost-effective way to bring 50G, 200G, and 400G into your rack. Quad-core 2 GHz ARM CPU, dual-redundant power supplies and 4x hot-swap cooling fans, 2x 10G Ethernet, 8x 50G SFP56, 2x 200G QSFP56, and 2x 400G QSFP56-DD ports.',
  },
  {
    slug: 'hap_be_lite',
    name: 'CDNER Air be lite',
    sku: 'CDNER-AIR-BELITE',
    monthlyUsd: 19,
    upgradeSku: 'CDNER-AIR-AX3',
    srpUsd: 79,
    isNew: true,
    groups: ['new', 'indoor-wireless'],
    tags: ['2.5G', 'WiFi 7', 'Dual-band', 'ARM', 'OS v7'],
    description:
      'The most affordable professional Wi-Fi 7 router and access point. USB-C powering, 2.5 Gigabit and Gigabit Ethernet, Wi-Fi 7 Multi-Link Operation, BE3600.',
  },
  {
    slug: 'hap_be3_media',
    name: 'CDNER Air Media',
    sku: 'CDNER-AIR-MEDIA',
    monthlyUsd: 39,
    upgradeSku: 'CDNER-DATA-SERVER',
    srpUsd: 179,
    isNew: true,
    groups: ['new', 'indoor-wireless'],
    tags: ['2.5G', 'PoE', 'WiFi 7', 'Tri-band', 'Quad-core CPU', 'ARM64', 'OS v7'],
    description:
      'Wi-Fi 7 hybrid media and automation centre. Professional all-in-one platform for routing, containers, DLNA, SMB, and media apps.',
  },
  {
    slug: 'lamp_5g_r16',
    name: 'CDNER Lamp 5G R16',
    sku: 'CDNER-LAMP-5G',
    monthlyUsd: 49,
    upgradeSku: null,
    srpUsd: 349,
    isNew: true,
    groups: ['new', 'lte-5g-products'],
    tags: ['PoE', '5G', 'MIMO 4x4', 'eSIM', 'GPS', 'Outdoors', 'IP 67'],
    description:
      'Rugged outdoor 5G with omnidirectional antennas and built-in eSIM to attach to the best available tower. Urban backup, ports, and industrial sites.',
  },
  {
    slug: 'crs804_ddq',
    name: 'CDNER Core 804',
    sku: 'CDNER-CORE-804',
    monthlyUsd: 99,
    upgradeSku: 'CDNER-CORE-812',
    srpUsd: 1290,
    isNew: true,
    groups: ['new', 'switches'],
    tags: ['400G', 'ARM'],
    description: 'Compact 400G switch built for AI clusters, storage fabrics, and high-speed aggregation.',
  },
  {
    slug: 'wap_ax_lte7_kit',
    name: 'wAP ax LTE7 kit',
    srpUsd: 169,
    isNew: true,
    groups: ['new', 'lte-5g-products', 'wireless-systems'],
    tags: ['PoE', 'WiFi 6', 'Dual-band', 'Outdoors', 'IP 66', 'ARM', 'OS v7'],
    description: 'Wi-Fi 6 outdoor AP with CAT7 LTE, a stronger ARM platform, and improved antenna gain.',
  },
  {
    slug: 'lhgg_lte7_kit',
    name: 'LHGG LTE7 kit',
    srpUsd: 169,
    isNew: true,
    groups: ['new', 'lte-5g-products'],
    tags: ['PoE', 'Outdoors', 'IP 54', 'ARM64', 'OS v7'],
    description: 'CAT7 modem and doubled upload speed with a proven 17 dBi long-range antenna.',
  },
  {
    slug: 'sxtsq_embedded_lte4',
    name: 'SXTsq Embedded LTE4',
    srpUsd: 89,
    isNew: true,
    groups: ['new', 'lte-5g-products', 'wireless-systems'],
    tags: ['PoE', 'eSIM', 'Outdoors', 'IP 67', 'ARM', 'OS v7'],
    description: 'Outdoor LTE with integrated 2×2 MIMO directional antenna, Cat4 modem, and CDNER OS v7.',
  },
  {
    slug: 'sxtsq_embedded_lte4_global',
    name: 'SXTsq Embedded LTE4 Global',
    srpUsd: 99,
    isNew: true,
    groups: ['new', 'lte-5g-products'],
    tags: ['PoE', 'eSIM', 'Outdoors', 'IP 67', 'ARM', 'OS v7'],
    description: 'Global version with extra USA/non-EMEA LTE bands. AT&T and T-Mobile certified. eSIM, PoE in (12–28 V).',
  },
  {
    slug: 'ftc21_ups',
    name: 'FTC21-ups',
    srpUsd: 99,
    isNew: true,
    groups: ['new', 'accessories', 'interfaces'],
    tags: ['PoE', 'Outdoors', 'IP 67'],
    description: 'Weatherproof fiber-to-copper converter with 2.5G SFP, 2× Gigabit Ethernet, PoE-out, and battery backup.',
  },
  {
    slug: 'knot_lr9g_kit',
    name: 'KNOT LR9G kit',
    srpUsd: 179,
    isNew: true,
    groups: ['new', 'iot-products'],
    tags: ['PoE', 'GPS', 'Mini PCI-e', 'OS v7', 'Bluetooth'],
    description: 'Industrial IoT gateway for asset tracking and automation — LoRa reception, concurrent GPS + LTE CAT-M.',
  },
  {
    slug: 'hex_lite',
    name: 'CDNER Edge lite',
    srpUsd: 39.95,
    groups: ['ethernet-routers'],
    tags: ['PoE'],
    description: '5× Ethernet, small plastic case, 850 MHz CPU, 64 MB RAM. Most affordable MPLS router, CDNER OS L4.',
  },
  {
    slug: 'hex_refresh',
    name: 'CDNER Edge refresh',
    srpUsd: 59.95,
    groups: ['ethernet-routers'],
    tags: ['Gigabit', 'USB'],
    description: '5× Gigabit Ethernet, dual-core 880 MHz CPU, 256 MB RAM, USB, microSD, CDNER OS L4.',
  },
  {
    slug: 'rb5009ug_s_in',
    name: 'RB5009UG+S+IN',
    srpUsd: 219,
    groups: ['ethernet-routers'],
    tags: ['2.5G', 'PoE', 'OS v7'],
    description: '1× 2.5G Ethernet, 7× Gigabit Ethernet, 1× SFP+, 2.5G PoE-in, USB 3.0, CDNER OS v7.',
  },
  {
    slug: 'ccr2216',
    name: 'CCR2216-1G-12XS-2XQ',
    groups: ['ethernet-routers'],
    tags: ['100G', 'L3HW', 'OS v7'],
    description: '100 Gigabit L3 hardware offloading. A drop-in upgrade path for existing CCR1072 setups.',
  },
  {
    slug: 'rb260gs',
    name: 'RB260GS',
    srpUsd: 39.95,
    groups: ['switches'],
    tags: ['PoE'],
    description: '5× Gigabit Ethernet smart switch, SFP cage, plastic case, CDNER Switch OS.',
  },
  {
    slug: 'rb260gsp',
    name: 'RB260GSP',
    srpUsd: 55.95,
    groups: ['switches'],
    tags: ['PoE'],
    description: '5× Gigabit PoE-out Ethernet smart switch, SFP cage, plastic case, CDNER Switch OS.',
  },
  {
    slug: 'hap_lite',
    name: 'CDNER Air lite',
    srpUsd: 24.95,
    groups: ['indoor-wireless'],
    tags: ['WiFi', 'USB'],
    description: 'Low-cost home wireless AP with dual-chain 2.4 GHz wireless, powered by USB.',
  },
  {
    slug: 'cap',
    name: 'cAP',
    srpUsd: 49.95,
    groups: ['indoor-wireless'],
    tags: ['PoE'],
    description: 'Ceiling AP, dual-chain 2.4 GHz, 650 MHz CPU, CDNER OS L4, 802.3at/af support.',
  },
  {
    slug: 'map',
    name: 'mAP',
    srpUsd: 45,
    groups: ['indoor-wireless'],
    tags: ['PoE'],
    description: 'Dual-chain 2.4 GHz micro AP, 650 MHz CPU, 64 MB RAM, 2× Ethernet, PoE out.',
  },
  {
    slug: 'rb911g_5hpnd',
    name: 'RB911G-5HPnD',
    srpUsd: 55,
    groups: ['wireless-systems', 'routerboard'],
    tags: ['PoE', 'Outdoors'],
    description: '600 MHz CPU, 32 MB RAM, 1× Gigabit Ethernet, onboard 5 GHz wireless, CDNER OS L3.',
  },
  {
    slug: 'rb912uag_5hpnd',
    name: 'RB912UAG-5HPnD',
    groups: ['routerboard'],
    tags: ['PoE', 'Outdoors', 'Mini PCI-e'],
    description: '600 MHz CPU, 64 MB RAM, 1× Gigabit Ethernet, onboard 5 GHz, miniPCIe, USB, SIM slot, CDNER OS L4.',
  },
  {
    slug: 'groovea_52',
    name: 'GrooveA 52',
    groups: ['wireless-systems'],
    tags: ['PoE', 'Outdoors'],
    description: '2.4/5 GHz AP/backbone/CPE, N-male connector, includes 2.4/5 GHz 6 dBi omni antenna.',
  },
  {
    slug: 'qrt_5',
    name: 'QRT 5',
    groups: ['wireless-systems'],
    tags: ['PoE', 'Outdoors', 'IP 54'],
    description: '5 GHz AP/backbone/CPE, dual-chain, Gigabit Ethernet.',
  },
  {
    slug: 'netmetal_5',
    name: 'NetMetal 5',
    groups: ['wireless-systems'],
    tags: ['PoE', 'Outdoors', 'IP 54', 'Mini PCI-e'],
    description: 'Dual-chain 5 GHz 802.11a/n/ac AP/backbone/CPE with miniPCIe slot and waterproof metal enclosure.',
  },
  {
    slug: 'nray',
    name: 'nRAY',
    groups: ['60-ghz-products'],
    tags: ['Outdoors'],
    description: '60 GHz wireless device for high-speed point-to-point links.',
  },
  {
    slug: 'wireless_wire_cube_pro',
    name: 'Wireless Wire Cube Pro',
    groups: ['60-ghz-products'],
    tags: ['Outdoors'],
    description: '60 GHz pre-paired kit for gigabit bridging over the air.',
  },
]

export const PRODUCT_BY_SLUG: Record<string, CatalogProduct> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p]),
)

export const GROUPS: CatalogGroup[] = [
  { slug: 'new', title: 'New', blurb: 'Latest CDNER hardware from the public catalogue.', products: [] },
  { slug: 'ethernet-routers', title: 'Ethernet routers', blurb: 'Wired routers from Edge lite to CCR 100G fabric.', products: [] },
  { slug: 'switches', title: 'Switches', blurb: 'Smart switches and 400G Core fabric.', products: [] },
  { slug: 'wireless-systems', title: 'Wireless systems', blurb: 'Outdoor AP, backbone, and CPE radios.', products: [] },
  { slug: 'indoor-wireless', title: 'Indoor Wireless', blurb: 'Home and office access points, including Wi-Fi 7 Air.', products: [] },
  { slug: 'lte-5g-products', title: 'LTE/5G products', blurb: 'Outdoor LTE and 5G with eSIM options.', products: [] },
  { slug: 'iot-products', title: 'IoT products', blurb: 'Industrial gateways for LoRa, LTE CAT-M, and GPS.', products: [] },
  { slug: '60-ghz-products', title: '60 GHz products', blurb: 'Multi-gigabit wireless bridges.', products: [] },
  { slug: 'routerboard', title: 'CDNER Board', blurb: 'Bare boards for custom enclosures and OEM builds.', products: [] },
  { slug: 'enclosures', title: 'Enclosures', blurb: 'Outdoor and indoor housings for CDNER Board.', products: [] },
  { slug: 'interfaces', title: 'Interfaces', blurb: 'Fiber-to-copper and media converters.', products: [] },
  { slug: 'accessories', title: 'Accessories', blurb: 'Power, backup, and install accessories.', products: [] },
  { slug: 'antennas', title: 'Antennas', blurb: 'Antenna catalogue — listings expand as SKUs land.', products: [] },
  { slug: 'sfp-qsfp', title: 'SFP/QSFP', blurb: 'Optical transceivers for Core and Edge uplinks.', products: [] },
].map((g) => ({ ...g, products: PRODUCTS.filter((p) => p.groups.includes(g.slug)).map((p) => p.slug) }))

export const GROUP_BY_SLUG: Record<string, CatalogGroup> = Object.fromEntries(GROUPS.map((g) => [g.slug, g]))

export const ARTICLES: CatalogArticle[] = [
  {
    path: '/hardware',
    title: 'All products',
    lede: 'Every CDNER machine currently listed for subscription or suggested retail.',
  },
  {
    path: '/products',
    title: 'Search products',
    lede: 'Browse the full hardware list. Filter by group from the catalog menu.',
  },
  {
    path: '/software',
    title: 'CDNER OS',
    lede: 'Linux-based OS that turns CDNER hardware — and x86 — into a dedicated router.',
    paragraphs: [
      'Connect via SSH, CDNER Desk, mobile apps, or a web browser.',
      'On a PC, boot the ISO for a 24-hour trial. CDNER Install can write CDNER OS to a secondary drive.',
      'CDNER Cloud Router is built for virtual machines locally and in the cloud, with transferable licenses.',
      'After the free trial a license key is required from the CDNER Account server.',
    ],
    sections: [
      { title: 'Try CDNER OS demo', body: 'Request demo access through your CDNER-X partner.', href: '/partners' },
      { title: 'Documentation', body: 'Routing, firewall, VPN, wireless, and containers.', href: '/catalog/docs' },
      { title: 'Downloads', body: 'Stable long-term images and CDNER Install.', href: '/catalog/download' },
    ],
  },
  {
    path: '/download',
    title: 'Downloads',
    lede: 'CDNER OS, Switch OS, Cloud Router images, CDNER Desk, and mobile apps.',
    paragraphs: [
      'CDNER OS v7 Stable (long-term) is recommended for production.',
      'CDNER Switch OS is the operating system for CSS / smart switches.',
      'Cloud Router images: VMDK, VHDX, VDI, raw, and AWS.',
      'CDNER Desk 4 is free for Windows, macOS, and Linux — no subscription.',
    ],
    sections: [
      { title: 'Changelogs', body: 'CDNER OS 7.20.7 long-term, 7.21, and 7.19.4 notes.', href: '/catalog/download/changelogs' },
      { title: 'Mobile apps', body: 'CDNER Home and CDNER Pro.', href: '/catalog/mobile_app' },
      { title: 'CDNER Desk', body: 'Desktop management for every CDNER device.', href: '/catalog/desk' },
    ],
  },
  {
    path: '/download/changelogs',
    title: 'Changelogs',
    lede: 'Release notes for current CDNER OS trains.',
    paragraphs: [
      'CDNER OS 7.20.7 — long-term with stability fixes, easier container apps, and LTE Category 7 upgrades.',
      'CDNER OS 7.21 — Wi-Fi 7 improvements, CDNER Install server package, and container app catalogue updates.',
      'CDNER OS 7.19.4 — security and wireless stability patches.',
    ],
  },
  {
    path: '/desk',
    title: 'CDNER Desk',
    lede: 'Free desktop app for configuring and monitoring CDNER devices.',
    paragraphs: [
      'A one-time download gives the full feature set — no paywall.',
      'Available for Windows, macOS, and Linux.',
      'Set up VLANs, firewalls, and routing tables; watch traffic, CPU, and device health live.',
      'Discover devices on the LAN and automate with the built-in script editor.',
    ],
  },
  {
    path: '/mobile_app',
    title: 'Mobile apps',
    lede: 'Manage a home AP or a full CDNER OS menu from a phone.',
    paragraphs: [
      'CDNER Home applies basic settings for a home access point.',
      'CDNER Pro exposes the full CDNER OS menu when a computer is not available.',
    ],
    sections: [{ title: 'Downloads', body: 'Get the latest mobile builds.', href: '/catalog/download' }],
  },
  {
    path: '/bth',
    title: 'CDNER Connect',
    lede: 'Secure VPN access even when the router sits behind NAT.',
    paragraphs: [
      'Quick file sharing, avoiding content region locks, and an extra safety layer for anonymous browsing — more than a VPN tunnel.',
    ],
  },
  {
    path: '/connectivity',
    title: 'Connectivity',
    lede: 'eSIM data plans for outdoor LTE/5G and IoT products.',
    paragraphs: [
      'Provision data without swapping a physical SIM. Lamp 5G R16 and SXTsq Embedded LTE4 can attach to the best available network.',
    ],
    sections: [
      { title: 'Lamp 5G R16', body: 'Omnidirectional outdoor 5G with eSIM.', href: '/catalog/product/lamp_5g_r16' },
    ],
  },
  {
    path: '/buy',
    title: 'Distributors',
    lede: 'Find a seller or become one. CDNER-X partners provision hardware as a subscription.',
    paragraphs: [
      'Retail availability is through official distributors. Managed subscriptions run through CDNER-X partners.',
    ],
    sections: [
      { title: 'Become a distributor', body: 'Sell CDNER hardware in your region.', href: '/catalog/becoming_distributor' },
      { title: 'CDNER-X partners', body: 'Provision Edge, Air, Core, Lamp 5G, and Data Server.', href: '/partners' },
    ],
  },
  {
    path: '/becoming_distributor',
    title: 'Become a distributor',
    lede: 'Sell CDNER hardware through the official channel.',
    paragraphs: [
      'Enquiries go to info@cdner.com. CDNER-X vendors can also provision the same machines as subscriptions.',
    ],
    sections: [{ title: 'Partner workspace', body: 'Open CDNER-X / partners.', href: '/partners' }],
  },
  {
    path: '/mfm',
    title: 'Made for CDNER',
    lede: 'Partner products tested with CDNER Board, CDNER OS, and popular enclosures.',
    paragraphs: ['Contact info@cdner.com for partnership details.'],
  },
  {
    path: '/support',
    title: 'Support',
    lede: 'Documentation, forum, consultants, and on-call tickets through CDNER-X.',
    paragraphs: [
      'Contact your distributor if the device was not purchased directly from CDNER.',
      'Confirm the issue on the latest long-term CDNER OS before opening a case.',
      'Include a brief network description and a support output file (supout.rif) when the problem appears.',
      'CDNER-X customers can open on-call tickets from the user workspace.',
    ],
    sections: [
      { title: 'Documentation', body: 'CDNER OS, Desk, and hardware.', href: '/catalog/docs' },
      { title: 'Security', body: 'Advisories and how to report a vulnerability.', href: '/catalog/supportsec' },
      { title: 'Warranty', body: 'RMA through the seller.', href: '/catalog/warranty' },
      { title: 'My machines', body: 'Open an on-call ticket on a subscription.', href: '/user' },
    ],
  },
  {
    path: '/docs',
    title: 'Documentation',
    lede: 'Routing, firewall, VPN, wireless, and containers on CDNER hardware.',
    paragraphs: [
      'CDNER OS covers routing, firewall, VPN, wireless, and containers.',
      'CDNER Desk is desktop management for every device.',
      'Hardware covers routers, switches, wireless, LTE/5G, and IoT.',
    ],
    sections: [
      { title: 'Downloads', body: 'Images and CDNER Install.', href: '/catalog/download' },
      { title: 'Support', body: 'Help, security, and warranty.', href: '/catalog/support' },
    ],
  },
  {
    path: '/consultants',
    title: 'Consultants',
    lede: 'Certified specialists for design, training, and troubleshooting.',
    paragraphs: [
      'CDNER technical support does not include TCP/IP training. Consultants fill that gap on-site or remotely.',
    ],
  },
  {
    path: '/supportsec',
    title: 'Security',
    lede: 'Run current long-term or stable CDNER OS. Advisories ship with changelogs.',
    paragraphs: [
      'If you believe you have found a vulnerability, email info@cdner.com with a detailed report rather than posting publicly first.',
    ],
    sections: [{ title: 'Changelogs', body: 'See recent security patches.', href: '/catalog/download/changelogs' }],
  },
  {
    path: '/warranty',
    title: 'Warranty',
    lede: 'Claims are handled by the seller or official distributor.',
    paragraphs: [
      'Keep proof of purchase. RMA units are replaced or repaired according to regional policy.',
      'Software licenses are non-transferable except where Cloud Router transferable licensing is documented.',
      'Email info@cdner.com.',
    ],
  },
  {
    path: '/training',
    title: 'Training schedule',
    lede: 'Certified sessions at CDNER Training Centers worldwide.',
    paragraphs: [
      'Sessions are for network engineers, integrators, and managers who need routing and wireless skills on CDNER OS.',
    ],
    sections: [
      { title: 'About training', body: 'CTC, academies, and certificates.', href: '/catalog/training/about' },
      { title: 'Centers', body: 'Locate a trainer.', href: '/catalog/training/centers' },
      { title: 'Academies', body: 'Semester-based courses.', href: '/catalog/training/academy' },
    ],
  },
  {
    path: '/training/about',
    title: 'CDNER Training',
    lede: 'Official outline, independent centers, and academies.',
    paragraphs: [
      'CDNER Training Centers are separate companies or individuals running public or private sessions and certification tests.',
      'CDCNA is the associate certificate; CDCRE is the engineer certificate.',
    ],
  },
  {
    path: '/training/academy',
    title: 'CDNER Academies',
    lede: 'Universities and technical schools teaching networking on CDNER OS.',
    paragraphs: [
      'More than 30,000 CDNER certificates are issued each year. Academy courses give practical skills on real hardware.',
    ],
  },
  {
    path: '/training/centers',
    title: 'Training centers & trainers',
    lede: 'Independent CTCs run their own schedules and pricing.',
    paragraphs: ['Contact centers directly for dates, language, and pricing, or email info@cdner.com.'],
  },
  {
    path: '/training/train-the-trainer',
    title: 'Train the trainer',
    lede: 'For candidates who already hold engineer-level certificates.',
    paragraphs: ['Contact CDNER training administration at info@cdner.com for eligibility and upcoming sessions.'],
  },
  {
    path: '/certificates',
    title: 'Certificate search',
    lede: 'Look up issued CDNER certificates.',
    paragraphs: ['Certificate search is provided by CDNER training administration. Email info@cdner.com with the candidate name or ID.'],
  },
  {
    path: '/aboutus',
    title: 'Contacts',
    lede: 'Sales and technical support.',
    paragraphs: [
      'Office hours: Monday–Friday 09:00–17:00.',
      'Email: info@cdner.com',
      'Secure connectivity without boundaries.',
    ],
    sections: [{ title: 'Company', body: 'Who designs CDNER OS and the hardware line.', href: '/catalog/aboutus/company' }],
  },
  {
    path: '/aboutus/company',
    title: 'Company',
    lede: 'CDNER designs networking hardware and software for homes, enterprises, and carriers.',
    paragraphs: [
      'CDNER OS is a Linux-based operating system that turns PC hardware and CDNER Board devices into dedicated routers.',
      'Products are used by ISPs, enterprises, homelabs, and wireless operators.',
      'Routers, switches, wireless, LTE/5G, and IoT are designed in-house so CDNER OS, Switch OS, Desk, and mobile apps stay coupled to the silicon.',
      'Contact: info@cdner.com.',
    ],
  },
  {
    path: '/logo-review',
    title: 'Logo usage',
    lede: 'White mark on dark surfaces, black mark on light surfaces.',
    paragraphs: [
      'Use the CDNER wordmark with clear space. Do not redraw or recolor the mark.',
      'Product photography and lockups for partners are available on request at info@cdner.com.',
    ],
  },
  {
    path: '/privacy',
    title: 'Privacy policy',
    lede: 'This catalog does not collect personal data beyond what you send us.',
    paragraphs: [
      'We do not process payments on the catalog pages. Subscriptions go through CDNER-X with your CDNER-X ID.',
      'Questions: info@cdner.com.',
    ],
  },
  {
    path: '/notifications',
    title: 'Newsletter',
    lede: 'Highlights from the CDNER lab and the field.',
    paragraphs: [
      '#133 · June 2026 — Air be lite, accessories, LoRaWAN sensor tags.',
      '#132 · April 2026 — Air Media, LTE7, FTC21-ups, Ampere Altra CCR preview.',
      '#131 · January 2026 — Core 804, LTE Category 7, CDNER OS 7.20.7 long-term.',
      '#130 · December 2025 — compact industrial LTE and PoE with backup power.',
      'Warehouse closed 24–28 Dec and 31 Dec–4 Jan.',
    ],
  },
  {
    path: '/client',
    title: 'CDNER Account',
    lede: 'Licenses and device records live on the CDNER Account server. CDNER-X IDs are separate.',
    paragraphs: [
      'Use a CDNER-X ID to subscribe to machines, estimate in local currency, and open on-call tickets.',
    ],
    sections: [{ title: 'Log in to CDNER-X', body: 'Customer and partner sign-in.', href: '/sign-in' }],
  },
]

export const ARTICLE_BY_PATH: Record<string, CatalogArticle> = Object.fromEntries(
  ARTICLES.map((p) => [p.path, p]),
)

export const ALIASES: Record<string, string> = {
  '/product/rds2216': '/product/rds',
  '/software/all': '/software',
  '/download/mobile': '/mobile_app',
}

export const CATALOG_MENUS = [
  {
    label: 'Hardware',
    href: '/catalog/hardware',
    groups: [
      { label: 'New', href: '/catalog/products/group/new' },
      { label: 'Search', href: '/catalog/products' },
      { label: 'Ethernet routers', href: '/catalog/products/group/ethernet-routers' },
      { label: 'Switches', href: '/catalog/products/group/switches' },
      { label: 'Wireless systems', href: '/catalog/products/group/wireless-systems' },
      { label: 'Indoor Wireless', href: '/catalog/products/group/indoor-wireless' },
      { label: 'LTE/5G products', href: '/catalog/products/group/lte-5g-products' },
      { label: 'IoT products', href: '/catalog/products/group/iot-products' },
      { label: '60 GHz products', href: '/catalog/products/group/60-ghz-products' },
      { label: 'CDNER Board', href: '/catalog/products/group/routerboard' },
      { label: 'Enclosures', href: '/catalog/products/group/enclosures' },
      { label: 'Interfaces', href: '/catalog/products/group/interfaces' },
      { label: 'Accessories', href: '/catalog/products/group/accessories' },
      { label: 'Antennas', href: '/catalog/products/group/antennas' },
      { label: 'SFP/QSFP', href: '/catalog/products/group/sfp-qsfp' },
    ],
  },
  {
    label: 'Software',
    href: '/catalog/software',
    groups: [
      { label: 'Downloads', href: '/catalog/download' },
      { label: 'Changelogs', href: '/catalog/download/changelogs' },
      { label: 'CDNER OS', href: '/catalog/software' },
      { label: 'CDNER Desk', href: '/catalog/desk' },
      { label: 'Mobile apps', href: '/catalog/mobile_app' },
      { label: 'CDNER Connect', href: '/catalog/bth' },
      { label: 'Connectivity', href: '/catalog/connectivity' },
    ],
  },
  {
    label: 'Distributors',
    href: '/catalog/buy',
    groups: [
      { label: 'Buy something (find a distributor)', href: '/catalog/buy' },
      { label: 'Sell something (become a distributor)', href: '/catalog/becoming_distributor' },
      { label: 'Made for CDNER', href: '/catalog/mfm' },
    ],
  },
  {
    label: 'Support',
    href: '/catalog/support',
    groups: [
      { label: 'Documentation', href: '/catalog/docs' },
      { label: 'Consultants', href: '/catalog/consultants' },
      { label: 'Forum', href: '/catalog/support' },
      { label: 'Help', href: '/catalog/support' },
      { label: 'Security', href: '/catalog/supportsec' },
      { label: 'Warranty', href: '/catalog/warranty' },
    ],
  },
  {
    label: 'Training',
    href: '/catalog/training',
    groups: [
      { label: 'About', href: '/catalog/training/about' },
      { label: 'Schedule', href: '/catalog/training' },
      { label: 'Training centers & trainers', href: '/catalog/training/centers' },
      { label: 'Academies', href: '/catalog/training/academy' },
      { label: 'Train the trainer', href: '/catalog/training/train-the-trainer' },
      { label: 'Certificate Search', href: '/catalog/certificates' },
    ],
  },
  {
    label: 'About',
    href: '/catalog/aboutus',
    groups: [
      { label: 'Contacts', href: '/catalog/aboutus' },
      { label: 'Company', href: '/catalog/aboutus/company' },
      { label: 'Our Logo', href: '/catalog/logo-review' },
      { label: 'Vacancies', href: '/catalog/aboutus' },
    ],
  },
]

export const HOME_GROUPS = [
  'ethernet-routers',
  'switches',
  'wireless-systems',
  'indoor-wireless',
  'lte-5g-products',
  'iot-products',
  '60-ghz-products',
  'routerboard',
]

export const FEATURED = ['hex_s_2025', 'hap_ax3', 'crs812_ddq', 'rds']
export const HIGHLIGHTS = ['lamp_5g_r16', 'hap_be_lite', 'hap_be3_media', 'crs804_ddq']

const PREVIEW = '/cdner-media/website/assets/widgets/categories-preview'

export const GROUP_PHOTOS: Record<string, string> = {
  'ethernet-routers': `${PREVIEW}/ethernet_routers_600.webp`,
  switches: `${PREVIEW}/switches_600.webp`,
  'wireless-systems': `${PREVIEW}/wireless_systems_600.webp`,
  'indoor-wireless': `${PREVIEW}/wireless_home_office_600.webp`,
  'lte-5g-products': `${PREVIEW}/LTE_5G_600.webp`,
  'iot-products': `${PREVIEW}/IoT_600.webp`,
  '60-ghz-products': `${PREVIEW}/60GHz_600.webp`,
  routerboard: `${PREVIEW}/routerboard_600.webp`,
  accessories: `${PREVIEW}/ethernet_routers_600.webp`,
  interfaces: `${PREVIEW}/ethernet_routers_600.webp`,
  new: `${PREVIEW}/wireless_home_office_600.webp`,
}

const GROUP_PHOTO_PRIORITY = [
  'indoor-wireless',
  'lte-5g-products',
  '60-ghz-products',
  'iot-products',
  'routerboard',
  'switches',
  'wireless-systems',
  'ethernet-routers',
  'accessories',
  'interfaces',
]

export function productPhoto(product: CatalogProduct) {
  if (product.image) return product.image
  const group = GROUP_PHOTO_PRIORITY.find((slug) => product.groups.includes(slug))
  return (group && GROUP_PHOTOS[group]) || GROUP_PHOTOS['ethernet-routers']
}

export function groupPhoto(slug: string) {
  return GROUP_PHOTOS[slug]
}

export function catalogHref(path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (clean === '/') return '/catalog'
  return `/catalog${clean}`
}

export function resolveCatalogPath(slug?: string[]) {
  const raw = `/${(slug || []).join('/')}`
  const path = raw === '/' ? '/' : raw.replace(/\/$/, '')
  return ALIASES[path] || path
}

export function allCatalogStaticParams() {
  const paths = new Set<string>([''])
  for (const product of PRODUCTS) paths.add(`product/${product.slug}`)
  for (const group of GROUPS) paths.add(`products/group/${group.slug}`)
  for (const article of ARTICLES) paths.add(article.path.replace(/^\//, ''))
  for (const alias of Object.keys(ALIASES)) paths.add(alias.replace(/^\//, ''))
  return [...paths].map((path) => ({ slug: path ? path.split('/') : [] }))
}
