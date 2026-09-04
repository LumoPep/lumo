import { NextRequest, NextResponse } from 'next/server';
import { isFirstOrder } from '@/lib/checkFirstOrder';
import { getSupabase } from '@/lib/supabase';
import {
  QuoteError,
  buildQuote,
  type PromoInput,
  type QuoteItemInput,
} from '@/lib/psc/quote';
import { signQuote } from '@/lib/psc/sign';

const QUOTE_ERROR_MESSAGE: Record<string, string> = {
  bad_item: 'That item is not in the catalog or the quantity is invalid.',
  bad_promo: 'That promo is not valid.',
  line_not_positive: 'Every product line must be greater than zero.',
  too_small: 'The order total is below the minimum.',
  too_many_lines: 'The cart has too many lines.',
};

interface PromoRow {
  type: string;
  value: number | null;
  usage_limit: number | null;
  usage_count: number;
  expires_at: string | null;
  active: boolean;
}

async function lookupPromo(code: string): Promise<PromoInput> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('promo_codes')
      .select('type, value, usage_limit, usage_count, expires_at, active')
      .eq('code', code.toUpperCase())
      .single<PromoRow>();
    if (error || !data) return null;
    if (!data.active) return null;
    if (data.expires_at && new Date(data.expires_at) < new Date()) return null;
    if (data.usage_limit !== null && data.usage_count >= data.usage_limit) return null;
    return {
      type: data.type as 'percent' | 'free_shipping',
      value: data.value ? parseFloat(data.value.toString()) : undefined,
    };
  } catch {
    return null;
  }
}

async function firstOrderFlag(email: string | undefined): Promise<boolean> {
  if (!email) return false;
  try {
    return await isFirstOrder(email);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.PSC_QUOTE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: { code: 'quote_unavailable' } },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'bad_item', message: QUOTE_ERROR_MESSAGE.bad_item } },
      { status: 400 },
    );
  }

  const payload = body as {
    items?: QuoteItemInput[];
    promoCode?: string;
    email?: string;
  };
  if (!Array.isArray(payload.items)) {
    return NextResponse.json(
      { error: { code: 'bad_item', message: QUOTE_ERROR_MESSAGE.bad_item } },
      { status: 400 },
    );
  }

  const promoCode =
    typeof payload.promoCode === 'string' && payload.promoCode.trim()
      ? payload.promoCode.trim()
      : '';
  const email =
    typeof payload.email === 'string' && payload.email.trim()
      ? payload.email.trim()
      : undefined;

  const promo = promoCode ? await lookupPromo(promoCode) : null;
  const first_order = await firstOrderFlag(email);

  try {
    const quote = buildQuote(payload.items, promo, first_order);
    const sig = signQuote(quote, secret);
    return NextResponse.json({
      quote,
      sig,
      first_order,
      promo_applied: promo !== null,
    });
  } catch (err) {
    if (err instanceof QuoteError) {
      return NextResponse.json(
        {
          error: {
            code: err.code,
            message: QUOTE_ERROR_MESSAGE[err.code] ?? 'The quote could not be built.',
          },
        },
        { status: 400 },
      );
    }
    throw err;
  }
}
