import { CartItem } from "./store";

const NOWPAYMENTS_API_URL = "https://api.nowpayments.io/v1";

export interface PaymentRequest {
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  ipn_callback_url?: string;
  order_id: string;
  order_description: string;
  success_url?: string;
  cancel_url?: string;
}

export interface PaymentResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  ipn_callback_url: string;
  created_at: string;
  updated_at: string;
  expiration_estimate_date: string;
}

export interface PaymentStatus {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  created_at: string;
  updated_at: string;
  outcome_amount: number;
  outcome_currency: string;
}

export class NOWPayments {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    method: string = "GET",
    body?: any
  ): Promise<T> {
    const response = await fetch(`${NOWPAYMENTS_API_URL}${endpoint}`, {
      method,
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `NOWPayments API error: ${response.status} - ${
          error.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  async getAvailableCurrencies(): Promise<{ currencies: string[] }> {
    return this.request("/currencies");
  }

  async getMinimumPaymentAmount(
    currency_from: string,
    currency_to: string = "usd"
  ): Promise<{ min_amount: number }> {
    return this.request(
      `/min-amount?currency_from=${currency_from}&currency_to=${currency_to}`
    );
  }

  async createPayment(
    paymentRequest: PaymentRequest
  ): Promise<PaymentResponse> {
    return this.request("/payment", "POST", paymentRequest);
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return this.request(`/payment/${paymentId}`);
  }

  async estimatePrice(
    amount: number,
    currency_from: string = "usd",
    currency_to: string
  ): Promise<{
    currency_from: string;
    amount_from: number;
    currency_to: string;
    estimated_amount: number;
  }> {
    return this.request(
      `/estimate?amount=${amount}&currency_from=${currency_from}&currency_to=${currency_to}`
    );
  }
}

// Helper function to generate order ID
export function generateOrderId(): string {
  return `LUMO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Helper function to create order description from cart
export function createOrderDescription(items: CartItem[]): string {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const productNames = items
    .map((item) => `${item.productName} (${item.variant})`)
    .join(", ");
  return `Lumo Order - ${itemCount} item${
    itemCount !== 1 ? "s" : ""
  }: ${productNames}`;
}

// Verify IPN signature
export function verifyIPNSignature(
  receivedSignature: string,
  ipnSecret: string,
  payload: string
): boolean {
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha512", ipnSecret);
  hmac.update(payload);
  const calculatedSignature = hmac.digest("hex");
  return calculatedSignature === receivedSignature;
}
