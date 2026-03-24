import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page     = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit    = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const category = searchParams.get('category');
    const gender   = searchParams.get('gender');
    const filter   = searchParams.get('filter'); // 'new' | 'bestseller'
    const sortBy   = searchParams.get('sortBy'); // 'price-asc' | 'price-desc' | 'newest'
    const offset   = (page - 1) * limit;

    const params: any[] = [];
    const conditions: string[] = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (gender) {
      params.push(gender);
      // Include 'Unisex'/'Kids' products in gender pages
      params.push(gender);
      conditions.push(`(gender = $${params.length - 1} OR gender IN ('Unisex', 'Kids'))`);
    }

    if (filter === 'new') {
      conditions.push(`is_new = TRUE`);
    } else if (filter === 'bestseller') {
      conditions.push(`is_bestseller = TRUE`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderClause = 'ORDER BY created_at DESC';
    if (sortBy === 'price-asc')  orderClause = 'ORDER BY price ASC';
    if (sortBy === 'price-desc') orderClause = 'ORDER BY price DESC';

    // Get total count for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated products
    params.push(limit, offset);
    const result = await pool.query(
      `SELECT * FROM products ${whereClause} ${orderClause} LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return NextResponse.json({
      products: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + result.rows.length < total,
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
