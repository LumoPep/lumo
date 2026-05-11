"use client";

export default function FooterDisclaimer() {
  return (
    <div
      className="w-full flex items-center justify-center"
      style={{
        background: '#607A5C',
        padding: '10px 24px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <p
        className="font-mono uppercase text-center"
        style={{
          fontSize: '10px',
          letterSpacing: '1.5px',
          color: 'white',
          margin: 0,
          opacity: 0.95,
        }}
      >
        Research Use Only · Not for Human Consumption · For Laboratory Research Purposes Only
      </p>
    </div>
  );
}
