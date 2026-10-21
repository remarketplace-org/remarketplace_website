/* Catalog data — placeholder figures for evaluation. Edit here to update the site. */
window.RM = {
  EXTRA: {
    "reID": { rating: 4.8, reviews: 126, price: "from $2,400/mo", deploy: "3 days", demo: "id.demo.remarketplace.io" },
    "Fractional ownership platform": { rating: 4.6, reviews: 84, price: "from $6,900/mo", deploy: "2 weeks", demo: "rwa.demo.remarketplace.io" },
    "Cashback & loyalty engine": { rating: 4.7, reviews: 152, price: "from $1,800/mo", deploy: "5 days", demo: "loyalty.demo.remarketplace.io" },
    "Build your exchange": { rating: 4.5, reviews: 61, price: "from $12,000/mo", deploy: "3 weeks", demo: "exchange.demo.remarketplace.io" },
    "Payments & wallets": { rating: 4.9, reviews: 203, price: "from $3,200/mo", deploy: "1 week", demo: "pay.demo.remarketplace.io" },
    "Lending & credit": { rating: 4.4, reviews: 47, price: "from $4,500/mo", deploy: "2 weeks", demo: "lend.demo.remarketplace.io" },
    "Digital asset custody": { rating: 4.8, reviews: 39, price: "from $8,400/mo", deploy: "2 weeks", demo: "custody.demo.remarketplace.io" },
    "Compliance & KYC suite": { rating: 4.6, reviews: 118, price: "from $2,100/mo", deploy: "4 days", demo: "kyc.demo.remarketplace.io" },
    "Token launchpad": { rating: 4.3, reviews: 55, price: "from $5,600/mo", deploy: "10 days", demo: "launch.demo.remarketplace.io" },
    "AI operations layer": { rating: 4.7, reviews: 97, price: "from $1,500/mo", deploy: "3 days", demo: "ai.demo.remarketplace.io" }
  },
  // tone: a | b | c | d → colour pairs defined in CSS (--t-a … --t-d)
  CATALOG: [
    { mark: "ID", name: "reID", category: "Identity", tone: "a", meta: "SSO + wallet",
      blurb: "Give users a single SSO plus multi-chain wallet that works across every app in your ecosystem.",
      includes: ["Passwordless SSO with social and email login", "Multi-chain custodial and self-custody wallets", "KYC/AML hooks and audit trail", "Admin console for roles and permissions"] },
    { mark: "FR", name: "Fractional ownership platform", category: "Real-world assets", tone: "b", meta: "RWA tokenisation",
      blurb: "Turn any high-value asset — real estate, jets, race-horses, IP — into tradable fractions and run a fully-compliant token marketplace.",
      includes: ["Asset onboarding and valuation workflow", "Fraction issuance and cap-table ledger", "Investor portal with secondary trading", "Compliance rules per jurisdiction"] },
    { mark: "LY", name: "Cashback & loyalty engine", category: "Loyalty", tone: "c", meta: "On- or off-chain",
      blurb: "Issue branded reward points, cash-back, and tiered perks; runs on-chain or off-chain with the same API.",
      includes: ["Points issuance, expiry and tier rules", "Cash-back settlement and payouts", "Partner redemption catalogue", "Campaign builder and analytics"] },
    { mark: "EX", name: "Build your exchange", category: "Trading", tone: "d", meta: "Spot + custody",
      blurb: "A white-label exchange with order matching, custody and compliance already wired together.",
      includes: ["Matching engine and order book", "Hot/cold custody with approvals", "Fiat on-ramp and off-ramp connectors", "Surveillance and reporting"] },
    { mark: "PY", name: "Payments & wallets", category: "Payments", tone: "a", meta: "Cards, transfers, QR",
      blurb: "Accept, hold and move money under your brand — card rails, bank transfers and QR payments in one ledger.",
      includes: ["Multi-currency accounts and ledger", "Card issuing and processing", "QR and link payments", "Reconciliation and statements"] },
    { mark: "LN", name: "Lending & credit", category: "Credit", tone: "c", meta: "Origination to servicing",
      blurb: "Originate, underwrite and service loans with configurable scoring and repayment schedules.",
      includes: ["Application and decisioning flow", "Scoring rules with AI-assisted review", "Repayment schedules and collections", "Portfolio dashboards"] },
    { mark: "CU", name: "Digital asset custody", category: "Custody", tone: "d", meta: "MPC vaults",
      blurb: "Institution-grade custody with policy-based approvals, MPC key management and full audit history.",
      includes: ["MPC key generation and recovery", "Policy engine and multi-approver flows", "Address allow-lists and screening", "Immutable audit log"] },
    { mark: "KY", name: "Compliance & KYC suite", category: "Identity", tone: "b", meta: "KYC, KYB, AML",
      blurb: "Verify individuals and businesses, screen transactions and file reports without stitching vendors together.",
      includes: ["Document and biometric verification", "Sanctions and PEP screening", "Transaction monitoring rules", "Case management and regulator reports"] },
    { mark: "TK", name: "Token launchpad", category: "Trading", tone: "a", meta: "Issue and distribute",
      blurb: "Design, issue and distribute tokens with vesting, whitelists and investor reporting built in.",
      includes: ["Token designer and smart-contract templates", "Whitelist and allocation management", "Vesting and cliff schedules", "Investor reporting portal"] },
    { mark: "AI", name: "AI operations layer", category: "AI", tone: "c", meta: "Agents and copilots",
      blurb: "Drop AI copilots into support, risk review and back-office operations across any product above.",
      includes: ["Support copilot on your knowledge base", "Risk and fraud review assistants", "Document extraction pipelines", "Prompt and policy controls"] }
  ],
  SORTS: ["Top rated", "Most reviewed", "Fastest to deploy", "A–Z"],
  LANGUAGES: ["English", "Arabic", "Hindi", "Spanish", "French", "Mandarin"],
  EXPERTS: [
    { name: "Sara Al-Mansouri", role: "Solutions lead — Payments & Custody", langs: ["English", "Arabic"], tz: "GST (UTC+4)", mark: "SA" },
    { name: "Rohan Iyer", role: "Solutions lead — Identity & AI", langs: ["English", "Hindi"], tz: "IST (UTC+5:30)", mark: "RI" },
    { name: "Daniel Whitfield", role: "Principal architect — Exchange & RWA", langs: ["English", "French"], tz: "GMT (UTC+0)", mark: "DW" },
    { name: "Lucía Ferrer", role: "Solutions lead — Loyalty & Lending", langs: ["English", "Spanish"], tz: "CET (UTC+1)", mark: "LF" },
    { name: "Wei Chen", role: "Solutions lead — Tokenisation", langs: ["English", "Mandarin"], tz: "SGT (UTC+8)", mark: "WC" }
  ],
  SLOTS: ["09:00", "09:30", "10:00", "11:00", "11:30", "13:00", "14:00", "14:30", "15:30", "16:00", "16:30"],
  FAQS: [
    { q: "What does “pre-built” actually mean?", a: "Each product is a running system — backend, admin console, APIs and front-end — already built, tested and deployed by us. You configure it, apply your brand, connect your data, and go live. Nothing is written from scratch." },
    { q: "How long until we are live?", a: "Between three days and three weeks depending on the product. Identity, loyalty and AI modules are the fastest; exchange and custody take longest because of compliance and key-management setup." },
    { q: "Whose brand does the customer see?", a: "Yours only. Domains, logo, colours, emails, app-store listings and documentation all ship under your brand name. reMarketplace stays invisible to your end users." },
    { q: "Can we run more than one product together?", a: "Yes. Products share one identity layer, one ledger and one admin console, so a wallet, loyalty engine and exchange behave like a single platform rather than three integrations." },
    { q: "Do we get the source code?", a: "Source access and self-hosting are available on enterprise agreements. Most customers stay on our managed deployment, which includes updates, monitoring and support." },
    { q: "Is the sandbox data on this page real?", a: "No. Every credential, rating and price shown here is placeholder test data for evaluation. Your account team issues real sandbox keys after the first demo call." }
  ]
};
