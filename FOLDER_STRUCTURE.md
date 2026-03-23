# Complete Folder Structure

```
clothing-store/
│
├── app/                           # Next.js 14 App Router
│   ├── api/                       # API routes
│   │   ├── products/
│   │   │   ├── route.ts          # GET /api/products (list all)
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET /api/products/:id (single product)
│   │   └── orders/
│   │       ├── create/
│   │       │   └── route.ts      # POST /api/orders/create (Razorpay order)
│   │       └── verify/
│   │           └── route.ts      # POST /api/orders/verify (payment verification)
│   │
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx          # Product detail page
│   │
│   ├── cart/
│   │   └── page.tsx              # Shopping cart & checkout
│   │
│   ├── layout.tsx                # Root layout with Header
│   ├── page.tsx                  # Home page (product listing)
│   └── globals.css               # Global Tailwind styles
│
├── components/                    # React components
│   ├── Header.tsx                # Navigation header with cart badge
│   └── ProductCard.tsx           # Reusable product card
│
├── store/                         # State management
│   └── cartStore.ts              # Zustand cart store
│
├── lib/                          # Utilities
│   └── db.ts                     # PostgreSQL connection pool
│
├── types/                        # TypeScript definitions
│   └── index.ts                  # Product, Order, CartItem types
│
├── database/                     # Database files
│   └── schema.sql                # PostgreSQL schema & sample data
│
├── public/                       # Static files (auto-created)
│   └── (static assets)
│
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── next.config.js                # Next.js configuration
└── README.md                     # Project documentation
```

## File Purposes

### App Directory
- **app/page.tsx**: Homepage with product grid
- **app/layout.tsx**: Root layout, includes Header component
- **app/products/[id]/page.tsx**: Dynamic product detail page
- **app/cart/page.tsx**: Shopping cart with Razorpay checkout

### API Routes
- **api/products/route.ts**: Fetches all products from database
- **api/products/[id]/route.ts**: Fetches single product by ID
- **api/orders/create/route.ts**: Creates Razorpay order & saves to DB
- **api/orders/verify/route.ts**: Verifies Razorpay payment signature

### Components
- **Header.tsx**: Navigation with cart item count
- **ProductCard.tsx**: Displays product info in grid

### Store
- **cartStore.ts**: Zustand state management for cart
  - Add/remove items
  - Update quantities
  - Persistent storage

### Configuration Files
- **package.json**: Dependencies (Next.js, React, Razorpay, pg, Zustand)
- **tsconfig.json**: TypeScript compiler options
- **tailwind.config.js**: Tailwind theme customization
- **next.config.js**: Next.js settings (image domains)

### Database
- **schema.sql**: Complete database schema with sample products
