# Quick Start Guide - Clothing Store

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd clothing-store
npm install
```

### Step 2: Setup Database
```bash
# Create PostgreSQL database
createdb clothing_store

# Run schema (creates tables and sample data)
psql clothing_store < database/schema.sql
```

### Step 3: Configure Environment
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials:
# - DATABASE_URL
# - RAZORPAY keys
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🔑 Getting Razorpay Test Keys

1. Visit: https://razorpay.com
2. Sign up for free account
3. Navigate to: Settings → API Keys
4. Get **Test Mode** keys:
   - Key ID (starts with `rzp_test_`)
   - Key Secret
5. Add to `.env.local`

### Test Payment Details
- **Card**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits

---

## 📁 Key Files to Know

- `app/page.tsx` - Product listing homepage
- `app/products/[id]/page.tsx` - Product details
- `app/cart/page.tsx` - Shopping cart & checkout
- `store/cartStore.ts` - Cart state management
- `database/schema.sql` - Database structure

---

## ✨ Features Included

✅ Product listing with images
✅ Product detail pages  
✅ Add to cart functionality
✅ Cart with quantity updates
✅ Razorpay payment integration
✅ Order management
✅ Responsive design
✅ TypeScript support

---

## 🐛 Common Issues

**Database connection error?**
→ Check PostgreSQL is running and DATABASE_URL is correct

**Payment not working?**
→ Verify Razorpay keys are in test mode and correctly added to .env.local

**Images not loading?**
→ Check internet connection (using Unsplash images)

---

## 📝 Next Steps

1. Customize products in database
2. Update styling in Tailwind config
3. Add more features (wishlist, reviews, etc.)
4. Deploy to Vercel or similar platform

**Happy coding! 🎉**
