import { pscDb, ORDERS_TABLE } from './psc/db';

export async function isFirstOrder(email: string): Promise<boolean> {
  try {
    const supabase = pscDb();
    if (!supabase) return false;

    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select('id')
      .ilike('email', email)
      .limit(1);

    if (error) {
      console.error('Error checking first order:', error);
      return false;
    }

    return !data || data.length === 0;
  } catch (err) {
    console.error('Error checking first order:', err);
    return false;
  }
}
