import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ success: true });
    }

    const supabase = createClient(url, key);
    // Sync to Omnisend
      try {
        const { omnisendUpsertContact } = await import('@/lib/omnisend');
        await omnisendUpsertContact({ email: email.toLowerCase().trim(), source: 'first_order_popup' });
      } catch (omniErr) {
        console.error('capture-email: omnisend sync failed', omniErr);
      }
      await supabase.from('email_captures').upsert(
      { email: email.toLowerCase().trim(), source: 'first_order_popup' },
      { onConflict: 'email' }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
