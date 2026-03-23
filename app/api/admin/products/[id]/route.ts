export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdminAuth } from '@/lib/adminAuth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdminAuth();
  if (denied) return denied;
  try {
    const body = await request.json();
    const { name, description, price, category, gender, image_url, stock, design_no, age_group, is_new, is_bestseller } = body;
    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, category=$4, gender=$5, image_url=$6,
       stock=$7, design_no=$8, age_group=$9, is_new=$10, is_bestseller=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [name, description, price, category, gender || 'Kids', image_url, stock, design_no, age_group, is_new ?? true, is_bestseller ?? false, params.id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdminAuth();
  if (denied) return denied;
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
