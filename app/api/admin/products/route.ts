export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdminAuth } from '@/lib/adminAuth';

export async function POST(request: Request) {
  const denied = await requireAdminAuth();
  if (denied) return denied;
  try {
    const body = await request.json();
    const { name, description, price, category, gender, image_url, stock, design_no, age_group, is_new, is_bestseller } = body;
    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, gender, image_url, stock, design_no, age_group, is_new, is_bestseller)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [name, description, price, category, gender || 'Kids', image_url, stock, design_no, age_group, is_new ?? true, is_bestseller ?? false]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
