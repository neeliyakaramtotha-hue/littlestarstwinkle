export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import pool from '@/lib/db';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

async function sendEmails(orderId: number, customer_name: string, customer_email: string, amount: number, items: any[]) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const smtpPass = process.env.SMTP_PASS;
  if (!adminEmail || !smtpPass) return;
  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: adminEmail, pass: smtpPass },
    });
    const itemsHtml = items.map(item => `<tr><td style="padding:10px;border-bottom:1px solid #eee;">${item.product.name}</td><td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td><td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.size||'-'}</td><td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">₹${Number(item.product.price).toFixed(2)}</td></tr>`).join('');
    await transporter.sendMail({
      from: `"LittleStarsTwinkle" <${adminEmail}>`,
      to: customer_email,
      subject: `✦ Order Confirmed! #${orderId} - LittleStarsTwinkle`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fdf0f8;padding:0;border-radius:16px;overflow:hidden;"><div style="background:linear-gradient(135deg,#e91e8c,#9b59b6);padding:30px;text-align:center;"><h1 style="color:white;margin:0;font-family:Georgia,serif;">✨ Order Confirmed!</h1><p style="color:rgba(255,255,255,0.85);margin-top:8px;">Thank you for shopping with LittleStarsTwinkle</p></div><div style="padding:30px;"><p style="color:#333;font-size:15px;">Hi <strong>${customer_name}</strong>,</p><p style="color:#555;font-size:14px;">Your order <strong>#${orderId}</strong> has been placed successfully! 🎉</p><div style="background:white;border-radius:12px;padding:20px;margin:20px 0;"><h3 style="color:#e91e8c;margin-top:0;">📦 Order Invoice</h3><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f5f0ff;"><th style="padding:10px;text-align:left;color:#9b59b6;font-size:12px;">PRODUCT</th><th style="padding:10px;text-align:center;color:#9b59b6;font-size:12px;">QTY</th><th style="padding:10px;text-align:center;color:#9b59b6;font-size:12px;">SIZE</th><th style="padding:10px;text-align:right;color:#9b59b6;font-size:12px;">PRICE</th></tr></thead><tbody>${itemsHtml}</tbody><tfoot><tr><td colspan="3" style="padding:14px 10px;font-weight:bold;color:#333;">Total Amount</td><td style="padding:14px 10px;font-weight:bold;color:#e91e8c;text-align:right;font-size:18px;">₹${Number(amount).toFixed(2)}</td></tr></tfoot></table></div><p style="color:#555;font-size:13px;">We'll notify you once your order is shipped.</p><div style="text-align:center;margin-top:24px;"><a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background:linear-gradient(135deg,#e91e8c,#9b59b6);color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:14px;">Continue Shopping ✦</a></div></div><div style="background:#f5f0ff;padding:16px;text-align:center;"><p style="color:#aaa;font-size:12px;margin:0;">© 2025 LittleStarsTwinkle. All rights reserved.</p></div></div>`,
    });
    await transporter.sendMail({
      from: `"LittleStarsTwinkle Orders" <${adminEmail}>`,
      to: adminEmail,
      subject: `🛒 New Order #${orderId} — ₹${Number(amount).toFixed(2)} from ${customer_name}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:30px;border-radius:12px;border:2px solid #e91e8c;"><h2 style="color:#e91e8c;margin-top:0;">🛒 New Order Received!</h2><p><strong>Order ID:</strong> #${orderId}</p><p><strong>Customer:</strong> ${customer_name} (${customer_email})</p><p><strong>Total:</strong> ₹${Number(amount).toFixed(2)}</p><table style="width:100%;border-collapse:collapse;margin-top:16px;"><thead><tr style="background:#f5f0ff;"><th style="padding:8px;text-align:left;">Product</th><th style="padding:8px;text-align:center;">Qty</th><th style="padding:8px;text-align:right;">Price</th></tr></thead><tbody>${items.map(i=>`<tr><td style="padding:8px;border-bottom:1px solid #eee;">${i.product.name}</td><td style="padding:8px;text-align:center;border-bottom:1px solid #eee;">${i.quantity}</td><td style="padding:8px;text-align:right;border-bottom:1px solid #eee;">₹${Number(i.product.price).toFixed(2)}</td></tr>`).join('')}</tbody></table><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="display:inline-block;margin-top:20px;background:#111;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View in Admin Panel →</a></div>`,
    });
  } catch (err) { console.error('Email send failed:', err); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer_name, customer_email, customer_phone, shipping_address, items } = body;
    const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt: `order_${Date.now()}` });
    const orderResult = await pool.query(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, total_amount, razorpay_order_id, payment_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [customer_name, customer_email, customer_phone, shipping_address, amount, order.id, 'pending']
    );
    const orderId = orderResult.rows[0].id;
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, size, color, price) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [orderId, item.product.id, item.product.name, item.quantity, item.size, item.color, item.product.price]
      );
    }
    sendEmails(orderId, customer_name, customer_email, amount, items);
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, dbOrderId: orderId });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
