export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdminAuth } from '@/lib/adminAuth';

export async function GET() {
  const denied = await requireAdminAuth();
  if (denied) return denied;
  try {
    const result = await pool.query(
      `SELECT o.*,
        json_agg(json_build_object(
          'product_name', oi.product_name,
          'quantity', oi.quantity,
          'size', oi.size,
          'price', oi.price
        )) FILTER (WHERE oi.id IS NOT NULL) as items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Orders fetch error:', err);
    return NextResponse.json([]);
  }
}

export async function PATCH(req: Request) {
  const denied = await requireAdminAuth();
  if (denied) return denied;
  try {
    const body = await req.json();
    const { id, order_status } = body;

    if (!id || !order_status) {
      return NextResponse.json({ error: 'Missing id or order_status' }, { status: 400 });
    }

    const allowed = ['confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'];
    if (!allowed.includes(order_status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await pool.query(
      `UPDATE orders SET order_status = $1 WHERE id = $2`,
      [order_status, id]
    );

    return NextResponse.json({ success: true, id, order_status });
  } catch (err) {
    console.error('Order status update error:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
