export function orderConfirmationHtml(order: {
  order_id: string;
  customer_name: string;
  email: string;
  items: Array<{ productName: string; variant: string; quantity: number; price: number }>;
  subtotal: number;
  discount_amount: number;
  discount_type: string | null;
  shipping_amount: number;
  total: number;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
}): string {
  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid rgba(26,24,20,0.08); font-family: Georgia, serif; font-style: italic; font-weight: 300; color: #1A1814; font-size: 15px;">
        ${item.productName}
        <div style="font-family: monospace; font-size: 11px; color: #1A1814; opacity: 0.55; font-style: normal; margin-top: 2px; letter-spacing: 0.05em;">
          ${item.variant} × ${item.quantity}
        </div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid rgba(26,24,20,0.08); font-family: monospace; font-size: 13px; color: #1A1814; text-align: right; vertical-align: top;">
        ${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const discountRow = order.discount_amount > 0 ? `
    <tr>
      <td style="padding: 8px 0; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #B8624A;">
        ${order.discount_type ?? 'Discount'}
      </td>
      <td style="padding: 8px 0; font-family: monospace; font-size: 13px; color: #B8624A; text-align: right;">
        -${order.discount_amount.toFixed(2)}
      </td>
    </tr>
  ` : '';

  const shippingRow = `
    <tr>
      <td style="padding: 8px 0; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #1A1814; opacity: 0.6;">
        Shipping
      </td>
      <td style="padding: 8px 0; font-family: monospace; font-size: 13px; color: #1A1814; text-align: right;">
        ${order.shipping_amount === 0 ? 'Free' : '$' + order.shipping_amount.toFixed(2)}
      </td>
    </tr>
  `;

  const address2Line = order.address2 ? `<br>${order.address2}` : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order Confirmed — Lumo</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5EFE4; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5EFE4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background-color: #1A1814; padding: 32px 40px; border-bottom: 3px solid #B8624A;">
              <img src="https://www.lumopep.com/lumo_logo_cream.png" alt="Lumo" height="36" style="display: block;">
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background-color: #EBE2CF; padding: 40px 40px 32px; text-align: center; border-bottom: 1px solid rgba(26,24,20,0.1);">
              <div style="width: 48px; height: 48px; border: 1.5px solid #607A5C; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #607A5C; font-size: 20px;">✓</span>
              </div>
              <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #1A1814; opacity: 0.6; margin: 0 0 8px;">Order confirmed</p>
              <h1 style="font-family: Georgia, serif; font-weight: 300; font-size: 28px; color: #1A1814; margin: 0 0 12px;">Payment confirmed</h1>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #1A1814; opacity: 0.7; margin: 0; line-height: 1.6;">
                Thank you, ${order.customer_name.split(' ')[0]}. Your order has been received and is being prepared.
              </p>
            </td>
          </tr>

          <!-- Order ID -->
          <tr>
            <td style="background-color: #EBE2CF; padding: 0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 16px 0; border-top: 1px solid rgba(26,24,20,0.1);">
                    <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #1A1814; opacity: 0.55;">Order ID</span>
                    <div style="font-family: monospace; font-size: 13px; color: #1A1814; margin-top: 4px;">${order.order_id}</div>
                  </td>
                  <td style="padding: 16px 0; border-top: 1px solid rgba(26,24,20,0.1); text-align: right;">
                    <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #1A1814; opacity: 0.55;">Status</span>
                    <div style="font-family: monospace; font-size: 13px; color: #607A5C; margin-top: 4px;">Confirmed</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="background-color: #F5EFE4; padding: 32px 40px; border-top: 1px solid rgba(26,24,20,0.1);">
              <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #1A1814; font-weight: 600; margin: 0 0 16px;">Your order</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
                ${discountRow}
                ${shippingRow}
                <tr>
                  <td style="padding: 16px 0 0; border-top: 2px solid rgba(26,24,20,0.15); font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #1A1814; font-weight: 600;">
                    Total
                  </td>
                  <td style="padding: 16px 0 0; border-top: 2px solid rgba(26,24,20,0.15); font-family: Georgia, serif; font-size: 22px; font-weight: 300; color: #1A1814; text-align: right;">
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping address -->
          <tr>
            <td style="background-color: #EBE2CF; padding: 32px 40px; border-top: 1px solid rgba(26,24,20,0.1);">
              <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #1A1814; font-weight: 600; margin: 0 0 12px;">Shipping to</p>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #1A1814; opacity: 0.8; line-height: 1.7; margin: 0;">
                ${order.customer_name}<br>
                ${order.address1}${address2Line}<br>
                ${order.city}, ${order.state} ${order.zip}<br>
                ${order.country}
              </p>
            </td>
          </tr>

          <!-- What happens next -->
          <tr>
            <td style="background-color: #F5EFE4; padding: 32px 40px; border-top: 1px solid rgba(26,24,20,0.1);">
              <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #1A1814; font-weight: 600; margin: 0 0 20px;">What happens next</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: monospace; font-size: 11px; color: #B8624A; padding-right: 12px; vertical-align: top; padding-top: 2px;">01 —</td>
                  <td style="font-family: Arial, sans-serif; font-size: 14px; color: #1A1814; opacity: 0.8; line-height: 1.6; padding-bottom: 12px;">Your order will be dispatched within 1–2 business days.</td>
                </tr>
                <tr>
                  <td style="font-family: monospace; font-size: 11px; color: #B8624A; padding-right: 12px; vertical-align: top; padding-top: 2px;">02 —</td>
                  <td style="font-family: Arial, sans-serif; font-size: 14px; color: #1A1814; opacity: 0.8; line-height: 1.6; padding-bottom: 12px;">Certificates of analysis for all products are available on each product page at lumopep.com.</td>
                </tr>
                <tr>
                  <td style="font-family: monospace; font-size: 11px; color: #B8624A; padding-right: 12px; vertical-align: top; padding-top: 2px;">03 —</td>
                  <td style="font-family: Arial, sans-serif; font-size: 14px; color: #1A1814; opacity: 0.8; line-height: 1.6;">Questions? Reply to this email or visit <a href="https://www.lumopep.com/contact" style="color: #B8624A;">lumopep.com/contact</a>.</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background-color: #F5EFE4; padding: 0 40px 32px; text-align: center;">
              <a href="https://www.lumopep.com/products" style="display: inline-block; background-color: #1A1814; color: #F5EFE4; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; padding: 14px 32px; text-decoration: none; border-left: 3px solid #B8624A;">
                → Continue shopping
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1A1814; padding: 24px 40px; text-align: center;">
              <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #F5EFE4; opacity: 0.4; margin: 0;">
                For research use only · Not for human or veterinary use · lumopep.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
