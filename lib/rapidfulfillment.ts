import https from 'https';

// Toggle RAPID_USE_TEST=true in env to hit the sandbox endpoint
const ENDPOINT =
  process.env.RAPID_USE_TEST === 'true'
    ? 'https://lumopep.rapidfulfillmentcrm.com/api/soap/'
    : 'https://lumopep.rapidfulfillmentcrm.com/api/soap/';

export interface RapidAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface RapidOrderItem {
  supplierCode: string;
  quantity: number;
  unitPrice: number;
}

export interface RapidOrder {
  orderId: string;
  orderDate: string;
  currency: string;
  source: string;
  billing: RapidAddress;
  shipping: RapidAddress;
  items: RapidOrderItem[];
}

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function soapRequest(body: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = new URL(ENDPOINT);
    const bodyBuffer = Buffer.from(body, 'utf-8');
    const options: https.RequestOptions = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Content-Length': bodyBuffer.length,
        'SOAPAction': '""',
      },
      // Disable SSL verification for the test sandbox only — its certificate
      // may be self-signed. Never set rejectUnauthorized: false in production.
      ...(process.env.RAPID_USE_TEST === 'true' && {
        agent: new https.Agent({ rejectUnauthorized: false }),
      }),
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk: Buffer) => { data += chunk.toString(); });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
}

function extractTag(xml: string, tag: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : null;
}

export async function login(): Promise<string> {
  const username = process.env.RAPID_API_USERNAME;
  const password = process.env.RAPID_API_PASSWORD;
  if (!username || !password) {
    throw new Error('Rapid Fulfillment credentials not configured (RAPID_API_USERNAME / RAPID_API_PASSWORD)');
  }

  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:api="http://lumopep.rapidfulfillmentcrm.com/api/soap/">
  <soapenv:Header/>
  <soapenv:Body>
    <api:login>
      <username>${xmlEscape(username)}</username>
      <password>${xmlEscape(password)}</password>
    </api:login>
  </soapenv:Body>
</soapenv:Envelope>`;

  const response = await soapRequest(envelope);
  const sessionKey =
    extractTag(response, 'sessionKey') ??
    extractTag(response, 'loginReturn') ??
    extractTag(response, 'return');

  if (!sessionKey) {
    throw new Error(`Rapid login failed. Response: ${response.substring(0, 500)}`);
  }
  return sessionKey;
}

export async function logout(sessionKey: string): Promise<void> {
  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:api="http://lumopep.rapidfulfillmentcrm.com/api/soap/">
  <soapenv:Header/>
  <soapenv:Body>
    <api:logout>
      <sessionKey>${xmlEscape(sessionKey)}</sessionKey>
    </api:logout>
  </soapenv:Body>
</soapenv:Envelope>`;

  await soapRequest(envelope).catch((err) =>
    console.error('Rapid logout error (non-fatal):', err)
  );
}

function addressXml(addr: RapidAddress): string {
  return [
    `<name>${xmlEscape(addr.name)}</name>`,
    `<address1>${xmlEscape(addr.address1)}</address1>`,
    addr.address2 ? `<address2>${xmlEscape(addr.address2)}</address2>` : '<address2/>',
    `<city>${xmlEscape(addr.city)}</city>`,
    `<state>${xmlEscape(addr.state)}</state>`,
    `<zip>${xmlEscape(addr.zip)}</zip>`,
    `<country>${xmlEscape(addr.country)}</country>`,
    addr.email ? `<email>${xmlEscape(addr.email)}</email>` : '',
    addr.phone ? `<phone>${xmlEscape(addr.phone)}</phone>` : '',
  ]
    .filter(Boolean)
    .join('\n      ');
}

export async function submitOrder(sessionKey: string, order: RapidOrder): Promise<string> {
  const itemsXml = order.items
    .map(
      (item) =>
        `<item>
          <supplierCode>${xmlEscape(item.supplierCode)}</supplierCode>
          <quantity>${item.quantity}</quantity>
          <unitPrice>${item.unitPrice.toFixed(2)}</unitPrice>
        </item>`
    )
    .join('\n        ');

  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:api="http://lumopep.rapidfulfillmentcrm.com/api/soap/">
  <soapenv:Header/>
  <soapenv:Body>
    <api:submitOrder>
      <sessionKey>${xmlEscape(sessionKey)}</sessionKey>
      <order>
        <orderId>${xmlEscape(order.orderId)}</orderId>
        <orderDate>${xmlEscape(order.orderDate)}</orderDate>
        <currency>${xmlEscape(order.currency)}</currency>
        <source>${xmlEscape(order.source)}</source>
        <billing>
          ${addressXml(order.billing)}
        </billing>
        <shipping>
          ${addressXml(order.shipping)}
        </shipping>
        <items>
        ${itemsXml}
        </items>
      </order>
    </api:submitOrder>
  </soapenv:Body>
</soapenv:Envelope>`;

  const response = await soapRequest(envelope);
  const result =
    extractTag(response, 'submitOrderReturn') ??
    extractTag(response, 'return') ??
    extractTag(response, 'status');

  if (!result) {
    throw new Error(`Rapid submitOrder failed. Response: ${response.substring(0, 500)}`);
  }
  return result;
}

export async function getStock(
  sessionKey: string,
  supplierCodes: string[]
): Promise<Record<string, number>> {
  const codesXml = supplierCodes.map((c) => `<code>${xmlEscape(c)}</code>`).join('');

  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:api="http://lumopep.rapidfulfillmentcrm.com/api/soap/">
  <soapenv:Header/>
  <soapenv:Body>
    <api:getStock>
      <sessionKey>${xmlEscape(sessionKey)}</sessionKey>
      <codes>${codesXml}</codes>
    </api:getStock>
  </soapenv:Body>
</soapenv:Envelope>`;

  const response = await soapRequest(envelope);
  const stockMap: Record<string, number> = {};
  const itemMatches = response.matchAll(
    /<item>[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>[\s\S]*?<qty[^>]*>([\s\S]*?)<\/qty>[\s\S]*?<\/item>/gi
  );
  for (const match of itemMatches) {
    stockMap[match[1].trim()] = parseInt(match[2].trim(), 10);
  }
  return stockMap;
}

/**
 * Convenience wrapper: handles session lifecycle (login → submitOrder → logout).
 * Use this in the webhook handler.
 */
export async function submitOrderWithSession(order: RapidOrder): Promise<string> {
  const sessionKey = await login();
  try {
    const result = await submitOrder(sessionKey, order);
    return result;
  } finally {
    await logout(sessionKey);
  }
}
