import { NextRequest, NextResponse } from "next/server";
import { pscDb, ORDERS_TABLE } from "@/lib/psc/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: { email?: string; order_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const order_id = String(body.order_id ?? "").trim();

  if (!email || !order_id) {
    return NextResponse.json({ error: "Email and order ID required" }, { status: 400 });
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
    .ilike("email", email)
    .ilike("order_id", order_id)
    .maybeSingle();

  if (error) {
    console.error("orders/lookup: query failed", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  return NextResponse.json({ order: data ?? null });
}
