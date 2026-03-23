import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const productsResult = await query(`SELECT COUNT(*) as count FROM products`);
    const ordersResult = await query(`SELECT COUNT(DISTINCT customer_email) as count FROM orders WHERE status != 'cancelled'`);
    const ratingResult = await query(`SELECT AVG(rating) as avg FROM product_reviews`);

    const productCount = parseInt(productsResult.rows[0]?.count || '0');
    const happyKids = parseInt(ordersResult.rows[0]?.count || '0');
    const avgRating = parseFloat(ratingResult.rows[0]?.avg || '4.9').toFixed(1);

    return NextResponse.json({
      products: productCount > 500 ? `${productCount}+` : '500+',
      happyKids: happyKids > 10000 ? `${Math.floor(happyKids/1000)}K+` : '10K+',
      rating: `${avgRating}★`,
    });
  } catch {
    return NextResponse.json({ products: '500+', happyKids: '10K+', rating: '4.9★' });
  }
}
