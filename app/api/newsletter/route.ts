import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Store subscriber in DB (table created in schema)
    await query(
      `INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
      [email]
    );

    // Send welcome email via Gmail if configured
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && process.env.SMTP_PASS) {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: adminEmail, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"LittleStarsTwinkle" <${adminEmail}>`,
        to: email,
        subject: '✦ Welcome to LittleStarsTwinkle Newsletter!',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fdf0f8;padding:40px;border-radius:16px;">
            <h1 style="font-family:Georgia,serif;color:#e91e8c;text-align:center;">✨ You're In! ✨</h1>
            <p style="color:#333;font-size:16px;text-align:center;">Welcome to the <strong>LittleStarsTwinkle</strong> family!</p>
            <p style="color:#555;font-size:14px;text-align:center;">You'll now receive alerts for new arrivals, best sellers, and exclusive deals.</p>
            <div style="text-align:center;margin-top:30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background:linear-gradient(135deg,#e91e8c,#9b59b6);color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;">Shop Now ✦</a>
            </div>
            <p style="color:#aaa;font-size:12px;text-align:center;margin-top:30px;">© 2025 LittleStarsTwinkle. All rights reserved.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    console.error('Newsletter error:', err);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await query(`SELECT email, subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC`);
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json([]);
  }
}
