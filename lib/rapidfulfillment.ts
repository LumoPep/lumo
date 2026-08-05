import https from 'https';

// Endpoint matches the soap:address location from the WSDL.
const ENDPOINT =
  process.env.RAPID_USE_TEST === 'true'
    ? 'https://lumopep.rapidfulfillmentcrm.com/api/soap/?action'
    : 'https://lumopep.rapidfulfillmentcrm.com/api/soap/?action';

// SOAPAction and namespace derived from WSDL:
//   targetNamespace: urn:WF
//   soapAction (all operations): urn:WF_Api_Soap_HandlerAction
//   binding style: RPC / SOAP encoding
const SOAP_ACTION = 'urn:WF_Api_Soap_HandlerAction';
const NS = 'urn:WF';

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
      // Include the query string (?wsdl / ?action) — pathname alone drops it
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Content-Length': bodyBuffer.length,
        'SOAPAction': SOAP_ACTION,
      },
      // Disable SSL verification when targeting the test endpoint — certificate
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
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:urn="${NS}">
  <soapenv:Header/>
  <soapenv:Body soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <urn:login>
      <username>${xmlEscape(username)}</username>
      <password>${xmlEscape(password)}</password>
    </urn:login>
  </soapenv:Body>
</soapenv:Envelope>`;

  const response = await soapRequest(envelope);
  // WSDL output parameter is named sessionId
  const sessionId =
    extractTag(response, 'sessionId') ??
    extractTag(response, 'return');

  if (!sessionId) {
    throw new Error(`Rapid login failed. Response: ${response.substring(0, 500)}`);
  }
  return sessionId;
}

export async function logout(sessionId: string): Promise<void> {
  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:urn="${NS}">
  <soapenv:Header/>
  <soapenv:Body soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <urn:logout>
      <sessionId>${xmlEscape(sessionId)}</sessionId>
    </urn:logout>
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
    .join('\n          ');
}

// WSDL operation: orders_new
// Input: sessionId (string), ordersData (ordersNewData complex type)
// Output: result (boolean)
export async function submitOrder(sessionId: string, order: RapidOrder): Promise<string> {
  const itemsXml = order.items
    .map(
      (item) =>
        `<item>
              <sku>${xmlEscape(item.supplierCode)}</sku>
              <qty>${item.quantity}</qty>
              <price>${item.unitPrice.toFixed(2)}</price>
            </item>`
    )
    .join('\n            ');

  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:urn="${NS}">
  <soapenv:Header/>
  <soapenv:Body soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <urn:orders_new>
      <sessionId>${xmlEscape(sessionId)}</sessionId>
      <ordersData>
        <order_id>${xmlEscape(order.orderId)}</order_id>
        <source>${xmlEscape(order.source)}</source>
        <order_date>${xmlEscape(order.orderDate)}</order_date>
        <currency>${xmlEscape(order.currency)}</currency>
        <billing_address>
          ${addressXml(order.billing)}
        </billing_address>
        <shipping_address>
          ${addressXml(order.shipping)}
        </shipping_address>
        <products>
            ${itemsXml}
        </products>
      </ordersData>
    </urn:orders_new>
  </soapenv:Body>
</soapenv:Envelope>`;

  const response = await soapRequest(envelope);
  // WSDL output parameter is named result (boolean — "1"/"true" on success)
  const result =
    extractTag(response, 'result') ??
    extractTag(response, 'return');

  if (!result) {
    throw new Error(`Rapid orders_new failed. Response: ${response.substring(0, 500)}`);
  }
  return result;
}

// WSDL operation: products_stock
// Input: sessionId (string), filters (filters complex type)
// Output: products (productsStockDataArray)
export async function getStock(
  sessionId: string,
  supplierCodes: string[]
): Promise<Record<string, number>> {
  const codesXml = supplierCodes
    .map((c) => `<filter><field>sku</field><value>${xmlEscape(c)}</value></filter>`)
    .join('');

  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:urn="${NS}">
  <soapenv:Header/>
  <soapenv:Body soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <urn:products_stock>
      <sessionId>${xmlEscape(sessionId)}</sessionId>
      <filters>${codesXml}</filters>
    </urn:products_stock>
  </soapenv:Body>
</soapenv:Envelope>`;

  const response = await soapRequest(envelope);
  const stockMap: Record<string, number> = {};
  const itemMatches = response.matchAll(
    /<item>[\s\S]*?<sku[^>]*>([\s\S]*?)<\/sku>[\s\S]*?<qty[^>]*>([\s\S]*?)<\/qty>[\s\S]*?<\/item>/gi
  );
  for (const match of itemMatches) {
    stockMap[match[1].trim()] = parseInt(match[2].trim(), 10);
  }
  return stockMap;
}

/**
 * Convenience wrapper: handles session lifecycle (login → orders_new → logout).
 * Use this in the webhook handler.
 */
export async function submitOrderWithSession(order: RapidOrder): Promise<string> {
  const sessionId = await login();
  try {
    const result = await submitOrder(sessionId, order);
    return result;
  } finally {
    await logout(sessionId);
  }
}
