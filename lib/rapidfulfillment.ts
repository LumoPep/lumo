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

// ordersAddressData complex type fields
export interface RapidAddress {
  customer_id: number;  // 0 for new / unknown customers
  firstname: string;
  surname: string;
  address: string;      // full address line(s)
  town: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
}

// ordersProductsData complex type fields
export interface RapidOrderItem {
  product_id: string;   // supplier code
  name: string;         // product display name
  qty: number;
}

// ordersData complex type fields
export interface RapidOrder {
  orderIdPrefix: number; // order_id_prefix — int(10) in Rapid schema
  orderId: number;       // order_id        — int(10) in Rapid schema
  source: string;
  orderDate: string;     // YYYY-MM-DD HH:MM:SS
  billing: RapidAddress;
  shipping: RapidAddress;
  items: RapidOrderItem[];
  totalCost: number;     // total_cost
  currency: string;
}

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function soapEnvelope(body: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:urn="${NS}"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
  <soapenv:Header/>
  <soapenv:Body soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    ${body}
  </soapenv:Body>
</soapenv:Envelope>`;
}

function soapRequest(body: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = new URL(ENDPOINT);
    const bodyBuffer = Buffer.from(body, 'utf-8');
    const options: https.RequestOptions = {
      hostname: url.hostname,
      // Include the query string (?action) — pathname alone drops it
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

function addressXml(addr: RapidAddress): string {
  return [
    `<customer_id xsi:type="xsd:integer">${addr.customer_id}</customer_id>`,
    `<firstname xsi:type="xsd:string">${xmlEscape(addr.firstname)}</firstname>`,
    `<surname xsi:type="xsd:string">${xmlEscape(addr.surname)}</surname>`,
    `<address xsi:type="xsd:string">${xmlEscape(addr.address)}</address>`,
    `<town xsi:type="xsd:string">${xmlEscape(addr.town)}</town>`,
    `<postcode xsi:type="xsd:string">${xmlEscape(addr.postcode)}</postcode>`,
    `<country xsi:type="xsd:string">${xmlEscape(addr.country)}</country>`,
    `<phone xsi:type="xsd:string">${xmlEscape(addr.phone)}</phone>`,
    `<email xsi:type="xsd:string">${xmlEscape(addr.email)}</email>`,
  ].join('\n            ');
}

export async function login(): Promise<string> {
  const username = process.env.RAPID_API_USERNAME;
  const password = process.env.RAPID_API_PASSWORD;
  if (!username || !password) {
    throw new Error('Rapid Fulfillment credentials not configured (RAPID_API_USERNAME / RAPID_API_PASSWORD)');
  }

  const envelope = soapEnvelope(`<urn:login>
      <username xsi:type="xsd:string">${xmlEscape(username)}</username>
      <password xsi:type="xsd:string">${xmlEscape(password)}</password>
    </urn:login>`);

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
  const envelope = soapEnvelope(`<urn:logout>
      <sessionId xsi:type="xsd:string">${xmlEscape(sessionId)}</sessionId>
    </urn:logout>`);

  await soapRequest(envelope).catch((err) =>
    console.error('Rapid logout error (non-fatal):', err)
  );
}

// WSDL operation: orders_new
// Input: sessionId (xsd:string), ordersData (urn:ordersData complex type)
// Output: result (xsd:boolean)
export async function submitOrder(sessionId: string, order: RapidOrder): Promise<string> {
  const itemsXml = order.items
    .map(
      (item) => `<item xsi:type="urn:ordersProductsData">
              <product_id xsi:type="xsd:string">${xmlEscape(item.product_id)}</product_id>
              <name xsi:type="xsd:string">${xmlEscape(item.name)}</name>
              <qty xsi:type="xsd:integer">${item.qty}</qty>
            </item>`
    )
    .join('\n            ');

  const envelope = soapEnvelope(`<urn:orders_new>
      <sessionId xsi:type="xsd:string">${xmlEscape(sessionId)}</sessionId>
      <ordersData xsi:type="urn:ordersData">
        <order_id_prefix xsi:type="xsd:integer">${order.orderIdPrefix}</order_id_prefix>
        <order_id xsi:type="xsd:integer">${order.orderId}</order_id>
        <source xsi:type="xsd:string">${xmlEscape(order.source)}</source>
        <order_date xsi:type="xsd:string">${xmlEscape(order.orderDate)}</order_date>
        <billing_address xsi:type="urn:ordersAddressData">
            ${addressXml(order.billing)}
        </billing_address>
        <shipping_address xsi:type="urn:ordersAddressData">
            ${addressXml(order.shipping)}
        </shipping_address>
        <products SOAP-ENC:arrayType="urn:ordersProductsData[]" xsi:type="SOAP-ENC:Array">
            ${itemsXml}
        </products>
        <total_cost xsi:type="xsd:float">${order.totalCost.toFixed(2)}</total_cost>
        <currency xsi:type="xsd:string">${xmlEscape(order.currency)}</currency>
      </ordersData>
    </urn:orders_new>`);

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
// Input: sessionId (xsd:string), filters (urn:filters complex type)
// Output: products (urn:productsStockDataArray)
export async function getStock(
  sessionId: string,
  supplierCodes: string[]
): Promise<Record<string, number>> {
  const codesXml = supplierCodes
    .map((c) => `<filter xsi:type="urn:filter"><field xsi:type="xsd:string">sku</field><value xsi:type="xsd:string">${xmlEscape(c)}</value></filter>`)
    .join('');

  const envelope = soapEnvelope(`<urn:products_stock>
      <sessionId xsi:type="xsd:string">${xmlEscape(sessionId)}</sessionId>
      <filters xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="urn:filter[]">${codesXml}</filters>
    </urn:products_stock>`);

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
