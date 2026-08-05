/**
 * TEST-ONLY endpoint — submits a dummy order to Supabase and Rapid Fulfillment.
 *
 * Access requires ONE of:
 *   • TEST_MODE=true in environment variables (local dev only)
 *   • x-test-secret header matching the TEST_SECRET environment variable
 *
 * NEVER deploy with TEST_MODE=true in production.
 * Remove or gate this route behind Vercel preview environments before go-live.
 *
 * Clean up test rows with:
 *   DELETE FROM orders WHERE order_id LIKE 'TEST-%';
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { submitOrderWithSession, type RapidOrder } from "@/lib/rapidfulfillment";
import { mapOrderItems, type CartItemLike } from "@/lib/orderMapping";

// Test items: two valid mappings + one deliberately unmapped to verify reporting
const TEST_ITEMS: CartItemLike[] = [
  { productId: "bpc-157",   productName: "BPC-157",   variant: "10mg",  price: 49.00, quantity: 1 },
  { productId: "bac-water", productName: "BAC Water", variant: "10ml",  price: 12.00, quantity: 2 },
  { productId: "unknown-x", productName: "Unknown",   variant: "999mg", price: 0.00,  quantity: 1 },
];

const TEST_ADDRESS: RapidOrder['billing'] = {
  customer_id: 0,
  firstname:   "Test",
  surname:     "Researcher",
  address:     "123 Lab Drive, Suite 400",
  town:        "Boston",
  postcode:    "02115",
  country:     "US",
  phone:       "",
  email:       "test@lumopep.com",
};

function isAuthorized(request: NextRequest): boolean {
  // Allow when TEST_MODE=true (local dev; must NOT be set in Vercel production)
  if (process.env.TEST_MODE === "true") return true;

  // Allow when a valid secret header is provided
  const testSecret = process.env.TEST_SECRET;
  if (testSecret) {
    const header = request.headers.get("x-test-secret");
    if (header === testSecret) return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "Forbidden — set TEST_MODE=true or provide x-test-secret header" },
      { status: 403 }
    );
  }

  const orderId = `TEST-${Date.now()}`;
  const orderIdPrefix = process.env.RAPID_ORDER_PREFIX ?? "1";
  const rapidEndpoint = "https://lumopep.rapidfulfillmentcrm.com/api/soap/?action";

  const results: Record<string, unknown> = {
    orderId,
    rapidOrderId: `${orderIdPrefix}-${orderId}`,
    rapidEndpoint,
    timestamp: new Date().toISOString(),
  };

  // ── 1. Item mapping ──────────────────────────────────────────────────────────
  const { mapped, unmapped } = mapOrderItems(TEST_ITEMS);
  results.itemMapping = {
    input: TEST_ITEMS,
    mapped,
    unmapped,
    mappedCount: mapped.length,
    unmappedCount: unmapped.length,
  };

  if (mapped.length === 0) {
    results.rapidSubmission = { skipped: true, reason: "No mappable items" };
    return NextResponse.json({ success: false, results }, { status: 422 });
  }

  // ── 2. Write test order to Supabase ─────────────────────────────────────────
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getSupabase() as any;
    const { data: dbData, error: dbError } = await supabase
      .from("orders")
      .insert({
        order_id:      orderId,
        payment_id:    "TEST-PAYMENT",
        email:         TEST_ADDRESS.email,
        customer_name: `${TEST_ADDRESS.firstname} ${TEST_ADDRESS.surname}`.trim(),
        address1:      "123 Lab Drive",
        address2:      "Suite 400",
        city:          "Boston",
        state:         "MA",
        zip:           "02115",
        country:       "US",
        items:         TEST_ITEMS,
        subtotal:      73.00,
        total:         73.00,
        currency:      "btc",
        status:        "test",
      })
      .select()
      .single();

    results.supabaseWrite = dbError
      ? { success: false, error: dbError.message, code: dbError.code }
      : { success: true, row: dbData };
  } catch (err) {
    results.supabaseWrite = {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // ── 3. Submit to Rapid Fulfillment ───────────────────────────────────────────
  try {
    const rapidOrder: RapidOrder = {
      orderIdPrefix,
      orderId:   orderId,
      source:    "lumo-web",
      orderDate: new Date().toISOString().replace("T", " ").substring(0, 19),
      currency:  "USD",
      billing:   TEST_ADDRESS,
      shipping:  TEST_ADDRESS,
      items:     mapped,
      totalCost: 73.00,
    };

    const t0 = Date.now();
    const rapidResponse = await submitOrderWithSession(rapidOrder);
    const elapsed = Date.now() - t0;

    results.rapidSubmission = {
      success:      true,
      response:     rapidResponse,
      elapsedMs:    elapsed,
      orderPayload: rapidOrder,
    };
  } catch (err) {
    results.rapidSubmission = {
      success: false,
      error:   err instanceof Error ? err.message : String(err),
    };
  }

  const allPassed =
    (results.supabaseWrite as { success?: boolean })?.success === true &&
    (results.rapidSubmission as { success?: boolean })?.success === true;

  return NextResponse.json({ success: allPassed, results }, {
    status: allPassed ? 200 : 207,
  });
}
