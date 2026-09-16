import { NextRequest, NextResponse } from 'next/server';
import { pscDb, ORDERS_TABLE } from '@/lib/psc/db';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ isFirstOrder: true });
  }

  try {
    const supabase = pscDb();
    if (!supabase) {
      console.error('check-first-order: PSC Supabase not configured');
      return NextResponse.json({ isFirstOrder: true });
    }

    console.log('check-first-order: querying table', ORDERS_TABLE, 'for email', email);

    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select('id')
      .ilike('email', email.trim())
      .limit(1);

    if (error) {
      console.error('check-first-order: query failed', error);
      return NextResponse.json({ isFirstOrder: true });
    }

    console.log('check-first-order: found', data?.length ?? 0, 'orders');
    return NextResponse.json({ isFirstOrder: !data || data.length === 0 });
  } catch (err) {
    console.error('check-first-order: error', err);
    return NextResponse.json({ isFirstOrder: true });
  }
}
