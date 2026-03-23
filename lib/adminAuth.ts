import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';
const SESSION_VALUE = 'authenticated';

/**
 * Call this at the top of every admin API route handler.
 * Returns null if the request is authenticated, or a 401 Response to return immediately.
 *
 * Usage:
 *   const denied = await requireAdminAuth();
 *   if (denied) return denied;
 */
export async function requireAdminAuth(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (session?.value === SESSION_VALUE) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
