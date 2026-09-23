const OMNISEND_API = 'https://api.omnisend.com/v3';

function getKey(): string | null {
  return process.env.OMNISEND_API_KEY ?? null;
}

async function post(path: string, body: unknown): Promise<void> {
  const key = getKey();
  if (!key) {
    console.warn('omnisend: OMNISEND_API_KEY not set, skipping');
    return;
  }
  try {
    const res = await fetch(`${OMNISEND_API}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Omnisend-API-Key ${key}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`omnisend: POST ${path} failed ${res.status}`, text);
    }
  } catch (err) {
    console.error(`omnisend: POST ${path} threw`, err);
  }
}

// Upsert a contact (email capture, checkout start, post-order)
export async function omnisendUpsertContact(params: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  source?: string;
}): Promise<void> {
  const nameParts = params.firstName
    ? { firstName: params.firstName, lastName: params.lastName ?? '' }
    : {};
  const now = new Date().toISOString();
  const identifiers: unknown[] = [{ type: 'email', id: params.email, sendWelcomeMessage: false, channels: { email: { status: 'subscribed', statusChangedAt: now } } }];
  if (params.phone) {
    identifiers.push({ type: 'phone', id: params.phone, sendWelcomeMessage: false, channels: { sms: { status: 'subscribed', statusChangedAt: now } } });
  }
  await post('/contacts', {
    identifiers,
    ...nameParts,
  });
}

// Order placed event
export async function omnisendOrderPlaced(order: {
  order_id: string;
  email: string;
  customer_name: string;
  items: Array<{ productName: string; variant: string; quantity: number; price: number }>;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  total: number;
  currency: string;
}): Promise<void> {
  const fullName = order.customer_name.trim();
  const spaceIdx = fullName.lastIndexOf(' ');
  const firstName = spaceIdx > 0 ? fullName.slice(0, spaceIdx) : fullName;
  const lastName = spaceIdx > 0 ? fullName.slice(spaceIdx + 1) : '';

  // Upsert contact first
  await omnisendUpsertContact({ email: order.email, firstName, lastName, phone: (order as any).phone || undefined });

  // Send order event
  await post('/orders', {
    orderID: order.order_id,
    email: order.email,
    orderNumber: order.order_id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currency: order.currency?.toUpperCase() ?? 'USD',
    orderSum: order.total,
    subTotalSum: order.subtotal,
    discountSum: order.discount_amount,
    shippingSum: order.shipping_amount,
    fulfillmentStatus: 'unfulfilled',
    paymentStatus: 'paid',
    products: order.items.map((item, i) => ({
      productID: `${order.order_id}-${i}`,
      variantID: item.variant,
      sku: item.variant,
      title: item.productName,
      quantity: item.quantity,
      price: item.price,
    })),
  });
}

// Order fulfilled event (for shipping notification)
export async function omnisendOrderFulfilled(orderId: string, email: string): Promise<void> {
  const key = getKey();
  if (!key) return;
  try {
    await fetch(`${OMNISEND_API}/orders/${encodeURIComponent(orderId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Omnisend-API-Key ${key}` },
      body: JSON.stringify({ fulfillmentStatus: 'fulfilled', updatedAt: new Date().toISOString() }),
    });
  } catch (err) {
    console.error('omnisend: PATCH order fulfilled threw', err);
  }
}
