export async function isFirstOrder(email: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/psc/check-first-order?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.isFirstOrder ?? true;
  } catch (err) {
    console.error('isFirstOrder: fetch failed', err);
    return true;
  }
}
