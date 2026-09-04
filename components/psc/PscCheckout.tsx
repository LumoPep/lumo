'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import type { Quote } from '@/lib/psc/quote';
import { CREATE_ATTEMPT_FAILED } from '@/lib/psc/buyerCopy';
import { mountGlue, type GlueHandle, type PaymentSurface, type PscEmbedInstance } from '@/lib/psc/glue';

export type PscCheckoutProps = {
  quote: Quote;
  sig: string;
  theme: 'light' | 'dark';
  pcid: string;
  serviceBase: string;
  onPaid: (orderRef: string) => void;
  onError: (msg: string) => void;
  onSurface?: (surface: PaymentSurface) => Promise<boolean>;
};

export function extractPscCheckoutFragment(html: string): string {
  const idIdx = html.indexOf('id="psc-checkout"');
  if (idIdx < 0) {
    throw new Error('panel.html is missing id="psc-checkout"');
  }
  const open = html.lastIndexOf('<div', idIdx);
  if (open < 0) {
    throw new Error('panel.html is missing the psc-checkout opening tag');
  }
  let depth = 0;
  let i = open;
  const openRe = /<div\b/gi;
  const closeRe = /<\/div>/gi;
  while (i < html.length) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const nextOpen = openRe.exec(html);
    const nextClose = closeRe.exec(html);
    const openAt = nextOpen ? nextOpen.index : Number.POSITIVE_INFINITY;
    const closeAt = nextClose ? nextClose.index : Number.POSITIVE_INFINITY;
    if (closeAt === Number.POSITIVE_INFINITY) {
      throw new Error('panel.html psc-checkout div is unclosed');
    }
    if (openAt < closeAt && nextOpen) {
      depth += 1;
      i = openAt + nextOpen[0].length;
    } else if (nextClose) {
      depth -= 1;
      i = closeAt + nextClose[0].length;
      if (depth === 0) {
        return html.slice(open, i);
      }
    } else {
      break;
    }
  }
  throw new Error('panel.html psc-checkout div is unclosed');
}

function ensureStylesheet(href: string) {
  if (document.querySelector(`link[data-psc-href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-psc-href', href);
  document.head.appendChild(link);
}

function waitFor(pred: () => boolean, ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      if (pred()) {
        resolve();
        return;
      }
      if (Date.now() - started > ms) {
        reject(new Error('timed out waiting for PscEmbed'));
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

export default function PscCheckout({
  quote,
  sig,
  theme,
  pcid,
  serviceBase,
  onPaid,
  onError,
  onSurface,
}: PscCheckoutProps) {
  void sig;
  const hostRef = useRef<HTMLDivElement>(null);
  const glueRef = useRef<GlueHandle | null>(null);
  const instRef = useRef<PscEmbedInstance | null>(null);
  const onPaidRef = useRef(onPaid);
  const onErrorRef = useRef(onError);
  const onSurfaceRef = useRef(onSurface);
  onPaidRef.current = onPaid;
  onErrorRef.current = onError;
  onSurfaceRef.current = onSurface;

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return undefined;

    (async () => {
      const res = await fetch('/panel.html');
      const html = await res.text();
      if (cancelled || !hostRef.current) return;
      host.innerHTML = extractPscCheckoutFragment(html);
      ensureStylesheet('/psc-embed-tokens.css');
      ensureStylesheet('/psc-embed.css');
      await waitFor(() => !!window.PscEmbed, 15000);
      if (cancelled || !window.PscEmbed) return;
      const inst = window.PscEmbed.init({
        pcid,
        serviceBase,
        theme,
        cart: quote.cart,
        onPaid: (orderRef: string) => onPaidRef.current(orderRef),
      });
      instRef.current = inst;
      glueRef.current = mountGlue(inst, {
        onPaid: (orderRef) => onPaidRef.current(orderRef),
        onError: (msg) => onErrorRef.current(msg),
        onSurface: onSurfaceRef.current
          ? (surface) => onSurfaceRef.current!(surface)
          : undefined,
      });
    })().catch(() => {
      if (!cancelled) onErrorRef.current(CREATE_ATTEMPT_FAILED);
    });

    return () => {
      cancelled = true;
      glueRef.current?.unmount();
      glueRef.current = null;
      instRef.current = null;
      host.innerHTML = '';
    };
  }, [pcid, serviceBase, theme, quote]);

  return (
    <>
      <div ref={hostRef} />
      <Script src="/psc-embed.js" strategy="afterInteractive" />
      {/* Stripe.js from js.stripe.com only: https://docs.stripe.com/js/including */}
      <Script src="https://js.stripe.com/v3/" strategy="afterInteractive" />
    </>
  );
}
