export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('product_id');
  try {
    const query = productId
      ? await pool.query(`SELECT * FROM product_reviews WHERE product_id=$1 ORDER BY created_at DESC`, [productId])
      : await pool.query(`SELECT product_id, ROUND(AVG(rating),1) as avg_rating, COUNT(*) as count FROM product_reviews GROUP BY product_id`);
    return NextResponse.json(query.rows);
  } catch { return NextResponse.json([]); }
}

export async function POST(req: Request) {
  try {
    const { product_id, customer_name, customer_email, rating, review } = await req.json();
    if (!product_id || !rating || rating < 1 || rating > 5)
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    const result = await pool.query(
      `INSERT INTO product_reviews (product_id, customer_name, customer_email, rating, review)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [product_id, customer_name || 'Anonymous', customer_email || '', rating, review || '']
    );
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
