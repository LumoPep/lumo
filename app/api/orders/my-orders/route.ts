import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { pscDb, ORDERS_TABLE } from "@/lib/psc/db";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = pscDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data, error } = await db
    .from(ORDERS_TABLE)
    .select(
      "order_id, created_at, status, items, subtotal, discount_amount, discount_type, discount_code, shipping_amount, total, customer_name"
    )
    .eq("email", session.user.email)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("orders/my-orders: query failed", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}
