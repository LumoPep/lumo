import { submitOrderWithSession, type RapidOrder } from '@/lib/rapidfulfillment';
import { mapOrderItems, type CartItemLike } from '@/lib/orderMapping';
import { rapidOrderId } from '@/lib/psc/order';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitToRapid(order: any): Promise<void> {
  try {

    const items: CartItemLike[] = Array.isArray(order.items) ? order.items : [];
    const { mapped, unmapped } = mapOrderItems(items);

    if (unmapped.length > 0) {
      console.warn(
        `Rapid: ${unmapped.length} item(s) missing supplier code mapping:`,
        unmapped.map((i) => `${i.productId}:${i.variant}`)
      );
    }

    if (mapped.length === 0) {
      console.error(`Rapid: order ${order.order_id} has no mappable items — skipping submission`);
      return;
    }

    // Split full name into firstname / surname for ordersAddressData
    const fullName = (order.customer_name || 'Research Customer').trim();
    const spaceIdx = fullName.lastIndexOf(' ');
    const firstname = spaceIdx > 0 ? fullName.slice(0, spaceIdx) : fullName;
    const surname   = spaceIdx > 0 ? fullName.slice(spaceIdx + 1) : '';

    // Combine address lines for the single `address` field
    const addressLine = [order.address1, order.address2].filter(Boolean).join(', ');

    const addressData: RapidOrder['shipping'] = {
      customer_id: 0,
      firstname,
      surname,
      address:  addressLine || '',
      town:     order.city    || '',
      postcode: order.zip     || '',
      country:  order.country || 'US',
      phone:    order.phone   || '',
      email:    order.email   || '',
    };

    // order_date must be YYYY-MM-DD HH:MM:SS
    const orderDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const numericOrderId = rapidOrderId(String(order.order_id ?? ''));

    const rapidOrder: RapidOrder = {
      orderIdPrefix: parseInt(process.env.RAPID_ORDER_PREFIX ?? '1', 10),
      orderId:       numericOrderId,
      source:        'lumo-web',
      orderDate,
      currency:      'USD',
      billing:       addressData,
      shipping:      addressData,
      items:         mapped,
      totalCost:     order.total ?? 0,
    };

    const result = await submitOrderWithSession(rapidOrder);
    console.log(`Rapid: order ${rapidOrder.orderIdPrefix}-${rapidOrder.orderId} submitted — response: ${result}`);
  } catch (err) {
    // Non-fatal: payment is already confirmed; log and continue
    console.error(`Rapid: failed to submit order ${order?.order_id}:`, err);
  }
}
