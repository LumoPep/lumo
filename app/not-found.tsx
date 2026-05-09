import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto mb-6">
          <circle cx="30" cy="30" r="29" stroke="#B8624A" strokeWidth="2" fill="none" />
          <circle cx="30" cy="30" r="8" fill="#B8624A" />
        </svg>
        <h1 className="font-display text-7xl text-ink mb-4" style={{ fontWeight: 300 }}>
          404
        </h1>
        <h2 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-4">
          PAGE NOT FOUND
        </h2>
        <p className="font-editorial text-ink opacity-60 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-ink text-bone font-mono text-xs uppercase tracking-mono hover:bg-clay transition-colors"
        >
          → RETURN HOME
        </Link>
      </div>
    </div>
  );
}
