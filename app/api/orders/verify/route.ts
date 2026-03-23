export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update order status
      await pool.query(
        `UPDATE orders 
         SET payment_status = $1, razorpay_payment_id = $2, razorpay_signature = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        ['completed', razorpay_payment_id, razorpay_signature, dbOrderId]
      );

      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified successfully' 
      });
    } else {
      // Update order status to failed
      await pool.query(
        `UPDATE orders 
         SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        ['failed', dbOrderId]
      );

      return NextResponse.json(
        { success: false, message: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
