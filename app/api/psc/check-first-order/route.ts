import { NextRequest, NextResponse } from 'next/server';
import { checkIsFirstOrder } from '@/lib/psc/checkIsFirstOrder';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ isFirstOrder: true });
  }
  const isFirstOrder = await checkIsFirstOrder(email);
  return NextResponse.json({ isFirstOrder });
}
