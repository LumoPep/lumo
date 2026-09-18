"use client";

export type OrderItem = {
  productId: string;
  productName: string;
  variant: string;
  price: number;
  quantity: number;
};

export type Order = {
  order_id: string;
  created_at: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  discount_type: string | null;
  discount_code: string | null;
  shipping_amount: number;
  total: number;
  customer_name: string;
};

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  let bg = "#607A5C";    // sage — paid / confirmed
  let color = "#F5EFE4"; // bone

  if (s === "pending" || s === "review") { bg = "#C89A3C"; color = "#1A1814"; } // ochre, ink
  if (s === "shipped")                   { bg = "#B8624A"; color = "#F5EFE4"; } // clay
  if (s === "failed")                    { bg = "#B33A2B"; color = "#F5EFE4"; } // red

  // Map "paid" to display label "CONFIRMED"
  const label = s === "paid" ? "CONFIRMED" : status.toUpperCase();

  return (
    <span
      className="font-mono"
      style={{
        fontSize: "9px",
        letterSpacing: "1.5px",
        backgroundColor: bg,
        color,
        padding: "3px 8px",
        display: "inline-block",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

export function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];
  const isShipped = order.status.toLowerCase() === "shipped";

  return (
    <div
      style={{
        backgroundColor: "#F5EFE4",
        borderLeft: "3px solid #B8624A",
        marginBottom: "16px",
      }}
    >
      {/* Header: order ID, date, status badge */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid rgba(26,24,20,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <span className="font-mono" style={{ fontSize: "11px", color: "#B8624A", letterSpacing: "0.5px" }}>
            {order.order_id}
          </span>
          <span className="font-mono" style={{ fontSize: "11px", color: "#1A1814", opacity: 0.55 }}>
            {date}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Line items */}
      <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(26,24,20,0.08)" }}>
        {items.length === 0 ? (
          <span className="font-functional" style={{ fontSize: "13px", color: "#1A1814", opacity: 0.4 }}>
            No item data
          </span>
        ) : (
          items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                paddingBottom: i < items.length - 1 ? "8px" : 0,
              }}
            >
              <span className="font-functional" style={{ fontSize: "13px", color: "#1A1814" }}>
                {item.productName}{" "}
                <span style={{ opacity: 0.55 }}>— {item.variant}</span>
                {" "}× {item.quantity}
              </span>
              <span
                className="font-functional"
                style={{ fontSize: "13px", color: "#1A1814", flexShrink: 0, marginLeft: "16px" }}
              >
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer: discount, shipping, total */}
      <div style={{ padding: "12px 20px 16px" }}>
        {order.discount_code && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span className="font-mono" style={{ fontSize: "10px", color: "#C89A3C", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              CODE: {order.discount_code}
            </span>
            <span className="font-mono" style={{ fontSize: "10px", color: "#C89A3C" }}>
              −${Number(order.discount_amount).toFixed(2)}
            </span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span
            className="font-mono"
            style={{ fontSize: "10px", color: "#1A1814", opacity: 0.55, letterSpacing: "0.5px", textTransform: "uppercase" }}
          >
            SHIPPING
          </span>
          <span className="font-mono" style={{ fontSize: "10px", color: "#1A1814", opacity: 0.55 }}>
            {Number(order.shipping_amount) === 0 ? "Free" : `$${Number(order.shipping_amount).toFixed(2)}`}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid rgba(26,24,20,0.1)",
          }}
        >
          <span
            className="font-mono"
            style={{ fontSize: "10px", color: "#1A1814", letterSpacing: "0.5px", textTransform: "uppercase" }}
          >
            TOTAL
          </span>
          <span className="font-display" style={{ fontSize: "1.15rem", fontWeight: 300, color: "#B8624A" }}>
            ${Number(order.total).toFixed(2)}
          </span>
        </div>

        {/* Tracking placeholder — shown for shipped orders */}
        {isShipped && (
          <div
            style={{
              marginTop: "12px",
              paddingTop: "10px",
              borderTop: "1px solid rgba(26,24,20,0.06)",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "9px",
                letterSpacing: "1px",
                color: "#1A1814",
                opacity: 0.35,
                textTransform: "uppercase",
              }}
            >
              TRACKING — AVAILABLE WHEN SHIPPED
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
