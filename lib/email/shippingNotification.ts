export function shippingNotificationHtml(data: {
  order_id: string;
  customer_name: string;
  tracking_number: string;
  carrier: string;
  estimated_delivery?: string | null;
  tracking_url?: string | null;
  items: Array<{ productName: string; variant: string; quantity: number; price: number }>;
}): string {
  const firstName = data.customer_name.split(' ')[0] || data.customer_name;

  const itemRows = data.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid rgba(26,24,20,0.08); font-family: Georgia, serif; font-style: italic; font-weight: 300; color: #1A1814; font-size: 15px;">
        ${item.productName}
        <div style="font-family: monospace; font-size: 11px; color: #1A1814; opacity: 0.55; font-style: normal; margin-top: 2px; letter-spacing: 0.05em;">
          ${item.variant} × ${item.quantity}
        </div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid rgba(26,24,20,0.08); font-family: monospace; font-size: 13px; color: #1A1814; text-align: right; vertical-align: top;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const estimatedRow = data.estimated_delivery ? `
    <tr>
      <td style="padding: 6px 0; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #1A1814; opacity: 0.6;">
        Est. Delivery
      </td>
      <td style="padding: 6px 0; font-family: monospace; font-size: 13px; color: #1A1814; text-align: right;">
        ${data.estimated_delivery}
      </td>
    </tr>
  ` : '';

  const trackingBtn = data.tracking_url ? `
    <a href="${data.tracking_url}"
       style="display: inline-block; background-color: #B8624A; color: #EBE2CF; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; text-decoration: none; padding: 12px 28px; margin-top: 8px;">
      TRACK YOUR SHIPMENT →
    </a>
  ` : `
    <p style="font-family: monospace; font-size: 13px; color: #1A1814; margin: 8px 0 0;">
      ${data.tracking_number}
    </p>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your order has shipped — ${data.order_id}</title>
  <style>:root{color-scheme:light only;}@media(prefers-color-scheme:dark){body{background-color:#F5EFE4!important;}}</style>
</head>
<body style="margin:0;padding:0;background-color:#F5EFE4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EFE4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1A1814;padding:32px 40px;">
              <span style="font-family:Georgia,serif;font-size:28px;font-weight:300;font-style:italic;color:#EBE2CF;letter-spacing:-0.02em;">Lumo</span>
              <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:#B8624A;vertical-align:top;margin-top:4px;margin-left:-2px;"></span>
              <div style="font-family:monospace;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#EBE2CF;opacity:0.5;margin-top:6px;">Research Peptides</div>
            </td>
          </tr>

          <!-- Shipped badge -->
          <tr>
            <td style="background-color:#B8624A;padding:14px 40px;">
              <span style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:#EBE2CF;">
                ● Your order has shipped
              </span>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="background-color:#EBE2CF;padding:40px 40px 24px;">
              <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:26px;font-weight:300;font-style:italic;color:#1A1814;line-height:1.2;">
                It's on its way, ${firstName}.
              </h1>
              <p style="margin:0;font-family:monospace;font-size:11px;color:#1A1814;opacity:0.55;text-transform:uppercase;letter-spacing:0.1em;">
                Order ${data.order_id}
              </p>
            </td>
          </tr>

          <!-- Tracking info -->
          <tr>
            <td style="background-color:#EBE2CF;padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EFE4;border-left:3px solid #B8624A;padding:20px 24px;">
                <tr>
                  <td>
                    <div style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#1A1814;opacity:0.55;margin-bottom:10px;">
                      Shipping details
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #1A1814; opacity: 0.6;">
                          Carrier
                        </td>
                        <td style="padding: 6px 0; font-family: monospace; font-size: 13px; color: #1A1814; text-align: right;">
                          ${data.carrier}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #1A1814; opacity: 0.6;">
                          Tracking #
                        </td>
                        <td style="padding: 6px 0; font-family: monospace; font-size: 13px; color: #1A1814; text-align: right;">
                          ${data.tracking_number}
                        </td>
                      </tr>
                      ${estimatedRow}
                    </table>
                    <div style="margin-top:20px;">
                      ${trackingBtn}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="background-color:#EBE2CF;padding:0 40px 40px;">
              <div style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#1A1814;opacity:0.55;margin-bottom:16px;">
                Items shipped
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="background-color:#EBE2CF;padding:0 40px;">
              <div style="border-top:1px solid rgba(26,24,20,0.1);"></div>
            </td>
          </tr>

          <!-- Support note -->
          <tr>
            <td style="background-color:#EBE2CF;padding:28px 40px 40px;">
              <p style="margin:0;font-family:monospace;font-size:11px;color:#1A1814;opacity:0.6;line-height:1.8;">
                Questions about your shipment? Reply to this email or contact<br/>
                <a href="mailto:support@lumopep.com" style="color:#B8624A;text-decoration:none;">support@lumopep.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1A1814;padding:24px 40px;">
              <p style="margin:0;font-family:monospace;font-size:10px;color:#EBE2CF;opacity:0.4;text-transform:uppercase;letter-spacing:0.1em;text-align:center;">
                Lumo Research Peptides · lumopep.com · For research use only
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
