<div align="center">
  <a href="https://zyphix.in">
    <img src="https://zyphix.in/favicon.svg" alt="Zyphix logo" width="88" height="88" />
  </a>

  # ZYPHIX

  **India's SuperLocal App**

  Groceries, food, pharmacy, and neighbourhood essentials—delivered from trusted local businesses.

  [![Website](https://img.shields.io/badge/Website-zyphix.in-111111?style=for-the-badge)](https://zyphix.in)
  [![Delivery](https://img.shields.io/badge/Delivery-Under_30_Minutes-16a34a?style=for-the-badge)](https://zyphix.in)
  [![Built for India](https://img.shields.io/badge/Built_for-Bharat-ff7a00?style=for-the-badge)](https://zyphix.in)
</div>

---

## About Zyphix

Zyphix is a hyperlocal commerce platform connecting customers with nearby kirana stores, restaurants, pharmacies, and local partners. It is designed to make neighbourhood shopping fast and convenient while helping independent businesses serve customers digitally.

The platform focuses on transparent pricing, real local inventory, and fast last-mile fulfilment—without relying on dark warehouses.

🌐 **Live website:** [zyphix.in](https://zyphix.in)

## Product Experiences

### ⚡ Zyphix Now

Fast access to everyday essentials from nearby stores, including:

- Fresh fruits and vegetables
- Dairy and eggs
- Snacks and beverages
- Pharmacy products
- Grains and staples
- Household and personal-care products

### 🍱 Zyphix Eats

Discover and order from neighbourhood restaurants, dhabas, cloud kitchens, and local favourites across categories such as biryani, pizza, burgers, thali, desserts, and street food.

### 🤝 Partner Network

Zyphix helps local merchants and restaurants reach nearby customers while retaining their neighbourhood identity. Businesses can join through the [partner portal](https://zyphix.in/partner).

## Key Features

- **Hyperlocal discovery** — surfaces relevant businesses around the customer's location
- **Fast delivery** — designed for fulfilment in under 30 minutes
- **Local-first marketplace** — works with kirana stores and independent food partners
- **Unified experience** — groceries, food, and pharmacy in one platform
- **Transparent pricing** — focused on fair pricing without surge charges
- **Real-time availability** — supports local inventory and order visibility
- **Responsive interface** — designed for mobile and desktop experiences
- **Location-aware ordering** — enables service discovery based on delivery area

## How It Works

1. **Set a location** — enter an address or use device location.
2. **Discover nearby options** — browse local stores, restaurants, and pharmacies.
3. **Place an order** — select products or meals through a unified ordering experience.
4. **Track fulfilment** — follow the order from the partner location to the doorstep.

## Technology

The production frontend is built as a modern React application using a Vite-based build pipeline. The repository is organized to support frontend, backend, database, deployment, and operational workflows.

```text
Zyphix/
├── frontend/          # Frontend application modules
├── backend/           # Backend services and APIs
├── src/               # Shared/product source code
├── supabase/          # Database configuration and migrations
├── scripts/           # Development and operational scripts
├── attached_assets/   # Project assets
├── artifacts/         # Generated or supporting artifacts
└── README.md
```

> The exact commands and environment variables are defined by the repository's package scripts and environment templates.

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (or the package manager associated with the repository lockfile)
- Git

### Setup

```bash
git clone https://github.com/sangralrahul/Zyphix.git
cd Zyphix
npm install
npm run dev
```

Open the local URL printed by the development server.

### Production Build

```bash
npm run build
npm run preview
```

Before running the application, configure the environment variables required by the checked-in environment template. Never commit production credentials or private API keys.

## Deployment

The production experience is available at [https://zyphix.in](https://zyphix.in).

Before deploying:

1. Run the production build locally.
2. Verify environment variables for the target environment.
3. Test location, authentication, ordering, partner, and responsive flows.
4. Merge reviewed changes into the deployment branch.
5. Confirm the production health check after release.

## Contributing

1. Create a feature branch from `main`.
2. Make a focused change with clear commit messages.
3. Run relevant checks and build the project locally.
4. Open a pull request describing the change and validation performed.
5. Merge only after review and successful checks.

```bash
git switch -c feature/short-description
git add -A
git commit -m "Add short description"
git push -u origin feature/short-description
```

## Security

Please do not disclose vulnerabilities in public issues. Report security concerns privately through the official contact options on [zyphix.in](https://zyphix.in).

## Company

Zyphix is a product of [Clavix Technologies Pvt. Ltd.](https://clavix.in).

---

<div align="center">
  Built for neighbourhoods. Built for Bharat.
  <br />
  © 2026 Clavix Technologies Pvt. Ltd. All rights reserved.
</div>
