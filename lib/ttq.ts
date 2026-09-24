declare global {
  interface Window {
    ttq?: {
      page: () => void;
      track: (event: string, params?: Record<string, unknown>) => void;
    };
  }
}

/** Safe accessor — returns null on server or before the pixel loads. */
export function ttq() {
  if (typeof window === 'undefined') return null;
  return window.ttq ?? null;
}
