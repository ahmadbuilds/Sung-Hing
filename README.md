# E-Commerce Application

A modern e-commerce web application built with Next.js, TypeScript, and Convex backend. This platform offers a complete shopping experience with brand management, product categories, recipes, and shopping cart functionality.

## Features

- **Product Catalog**: Browse and search products with detailed information
- **Brand Management**: Explore products by different brands with dedicated brand pages
- **Categories**: Organized product categories for easy navigation
- **Shopping Cart**: Add, remove, and manage items in your cart
- **Recipes**: Discover recipes and related products
- **User Authentication**: Secure user authentication and profile management
- **Responsive Design**: Mobile-friendly interface with modern UI components
- **Real-time Updates**: Powered by Convex for real-time data synchronization

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, React, TypeScript
- **Styling**: Tailwind CSS with custom UI components
- **Backend**: Convex (serverless backend platform)
- **UI Components**: Custom component library with shadcn/ui
- **State Management**: React hooks and Convex queries

## Project Structure

```
demo/
├── app/
│   ├── About/
│   │   └── page.tsx
│   ├── Brand/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── Cart/
│   │   └── page.tsx
│   ├── Categories/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── Contact/
│   │   └── page.tsx
│   ├── hooks/
│   │   └── ConvertToUrl.tsx
│   ├── Product/
│   │   └── page.tsx
│   ├── Recipe/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── sonner.tsx
│   ├── BrandItem.tsx
│   ├── CategoryItem.tsx
│   ├── ConvexClientProvider.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ProductItem.tsx
│   └── SyncUserWithConvex.tsx
├── convex/
│   ├── _generated/
│   │   ├── api.d.ts
│   │   ├── api.js
│   │   ├── dataModel.d.ts
│   │   ├── server.d.ts
│   │   └── server.js
│   ├── Brand.ts
│   ├── Cart.ts
│   ├── Categories.ts
│   ├── Product.ts
│   ├── Recipe.ts
│   ├── SampleData.json
│   ├── schema.ts
│   ├── Storage.ts
│   └── users.ts
├── lib/
│   └── utils.ts
├── public/
├── components.json
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Convex account (for backend services)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd demo
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up Convex:

```bash
npx convex dev
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Components

- **App Router**: Next.js 14 app directory structure for routing
- **Dynamic Routes**: Brand and category pages with dynamic ID-based routing
- **UI Components**: Reusable components including buttons, cards, carousels, dialogs, and more
- **Convex Integration**: Real-time backend for brands, categories, products, recipes, cart, and user management
- **Custom Hooks**: Utility hooks for URL conversion and other common operations

## Development

- Main application pages are in the `app/` directory
- Reusable components are in the `components/` directory
- Backend functions and schema are in the `convex/` directory
- Global styles are defined in `app/globals.css`
- UI components follow the shadcn/ui pattern in `components/ui/`

## License

MIT License
