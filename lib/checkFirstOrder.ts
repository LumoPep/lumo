import { getSupabase } from './supabase';

export async function isFirstOrder(email: string): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .ilike('email', email)
      .limit(1);

    if (error) {
      console.error('Error checking first order:', error);
      return false;
    }

    // If no orders found, it's a first order
    return !data || data.length === 0;
  } catch (err) {
    console.error('Error checking first order:', err);
    return false;
  }
}
