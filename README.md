# Clothing Store - Next.js E-commerce Application

A full-featured e-commerce clothing store built with Next.js, PostgreSQL, and Razorpay payment integration.

## Features

- 🛍️ Product listing with categories
- 📝 Detailed product pages
- 🛒 Shopping cart with persistent storage
- 💳 Razorpay payment integration
- 📦 Order management
- 🎨 Responsive design with Tailwind CSS
- 🗄️ PostgreSQL database

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: PostgreSQL
- **Payment Gateway**: Razorpay
- **Image Optimization**: Next.js Image

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Razorpay account (test or live)

## Installation

1. **Clone and navigate to the project:**
```bash
cd clothing-store
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up PostgreSQL database:**
```bash
# Create a database named 'clothing_store'
createdb clothing_store

# Run the schema file
psql clothing_store < database/schema.sql
```

4. **Configure environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/clothing_store
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Run the development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Project Structure

```
clothing-store/
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts          # Get all products
│   │   │   └── [id]/route.ts     # Get single product
│   │   └── orders/
│   │       ├── create/route.ts   # Create Razorpay order
│   │       └── verify/route.ts   # Verify payment
│   ├── products/
│   │   └── [id]/page.tsx         # Product detail page
│   ├── cart/
│   │   └── page.tsx              # Shopping cart page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (product listing)
│   └── globals.css               # Global styles
├── components/
│   ├── Header.tsx                # Navigation header
│   └── ProductCard.tsx           # Product card component
├── store/
│   └── cartStore.ts              # Zustand cart state management
├── lib/
│   └── db.ts                     # PostgreSQL connection
├── types/
│   └── index.ts                  # TypeScript types
├── database/
│   └── schema.sql                # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get single product

### Orders
- `POST /api/orders/create` - Create Razorpay order
- `POST /api/orders/verify` - Verify payment signature

## Database Schema

### Tables

**products**
- id, name, description, price, category, image_url
- sizes[], colors[], stock
- created_at, updated_at

**orders**
- id, customer_name, customer_email, customer_phone
- shipping_address, total_amount, payment_status
- razorpay_order_id, razorpay_payment_id, razorpay_signature
- created_at, updated_at

**order_items**
- id, order_id, product_id, product_name
- quantity, size, color, price
- created_at

## Razorpay Integration

### Test Mode
1. Sign up at [Razorpay](https://razorpay.com)
2. Get test API keys from dashboard
3. Use test card: 4111 1111 1111 1111, any future date, any CVV

### Payment Flow
1. User adds items to cart
2. Fills checkout form
3. Backend creates Razorpay order
4. Frontend opens Razorpay checkout
5. User completes payment
6. Backend verifies signature
7. Order status updated

## Cart Features

- Add/remove items
- Update quantities
- Size and color selection
- Persistent storage (localStorage)
- Real-time total calculation

## Customization

### Adding Products
Manually add to database or create an admin panel:
```sql
INSERT INTO products (name, description, price, category, image_url, stock)
VALUES ('Product Name', 'Description', 99.99, 'Category', 'image-url', 100);
```

### Styling
Modify `tailwind.config.js` for custom colors and themes.

### Payment Currency
Change currency in `app/api/orders/create/route.ts`:
```typescript
currency: 'INR', // Change to USD, EUR, etc.
```

## Production Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Set up production database**

3. **Configure environment variables on hosting platform**

4. **Deploy to Vercel/Netlify/Railway:**
```bash
npm run start
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Razorpay Payment Fails
- Verify API keys are correct
- Check test/live mode consistency
- Review Razorpay dashboard logs

### Images Not Loading
- Check image URLs are accessible
- Verify Next.js image domains in `next.config.js`

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions, please check:
- [Next.js Documentation](https://nextjs.org/docs)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
