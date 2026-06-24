import { getSupabase } from './supabase';

interface PromoCodeData {
  id: string;
  code: string;
  type: string;
  value: number | null;
  usage_limit: number | null;
  usage_count: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
}

export async function validatePromoCode(
  code: string
): Promise<
  | { valid: true; promo: { type: 'percent' | 'free_shipping'; value?: number } }
  | { valid: false; error: string }
> {
  try {
    const supabase = getSupabase();
    // Query the promo_codes table
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single<PromoCodeData>();

    if (error || !data) {
      return { valid: false, error: 'Invalid code' };
    }

    // Check if active
    if (!data.active) {
      return { valid: false, error: 'Invalid code' };
    }

    // Check if expired
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at);
      if (expiresAt < new Date()) {
        return { valid: false, error: 'Code expired' };
      }
    }

    // Check usage limit
    if (data.usage_limit !== null && data.usage_count >= data.usage_limit) {
      return { valid: false, error: 'Code no longer available' };
    }

    // Return valid promo
    return {
      valid: true,
      promo: {
        type: data.type as 'percent' | 'free_shipping',
        value: data.value ? parseFloat(data.value.toString()) : undefined,
      },
    };
  } catch (err) {
    console.error('Error validating promo code:', err);
    return { valid: false, error: 'Invalid code' };
  }
}
