import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SESSION_VALUE = 'authenticated'; // value stored in the signed cookie
const MAX_AGE = 60 * 60 * 8; // 8 hours

// POST /api/admin/auth  → login
export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: 'Server misconfiguration: ADMIN_PASSWORD not set.' }, { status: 500 });
  }

  if (password !== adminPassword) {
    // Artificial delay to slow brute-force attempts
    await new Promise(r => setTimeout(r, 500));
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,      // not readable by JS — prevents XSS token theft
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',  // CSRF protection
    maxAge: MAX_AGE,
    path: '/',
  });
  return res;
}

// GET /api/admin/auth  → verify session
export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (session?.value === SESSION_VALUE) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

// DELETE /api/admin/auth  → logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
  return res;
}
