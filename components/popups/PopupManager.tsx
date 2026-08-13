"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store";
import { PRODUCTS } from "@/data/products";
import EmailCapturePopup from "./EmailCapturePopup";
import ExitIntentPopup from "./ExitIntentPopup";
import CartExitPopup from "./CartExitPopup";
import CartIdlePopup from "./CartIdlePopup";
import BacWaterPopup from "./BacWaterPopup";

type ActivePopup = "email" | "exit" | "cartExit" | "cartIdle" | "bacWater" | null;

// Slugs that do NOT require BAC water (non-injectables)
const noBAC = new Set(["nad-plus", "bac-water", "glow-blend", "klow-blend"]);

export default function PopupManager() {
  const [mounted, setMounted] = useState(false);
  const [activePopup, setActivePopup] = useState<ActivePopup>(null);

  // Refs so event handlers always see latest values without re-registration
  const activePopupRef = useRef<ActivePopup>(null);
  const cooldownRef = useRef(false);
  const items = useCartStore((state) => state.items);
  const itemsRef = useRef(items);

  useEffect(() => { activePopupRef.current = activePopup; }, [activePopup]);
  useEffect(() => { itemsRef.current = items; }, [items]);

  // Only run client-side
  useEffect(() => { setMounted(true); }, []);

  const tryShow = (popup: ActivePopup) => {
    if (cooldownRef.current || activePopupRef.current !== null) return;
    setActivePopup(popup);
    activePopupRef.current = popup;
  };

  const close = () => {
    setActivePopup(null);
    activePopupRef.current = null;
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 3000);
  };

  // ── POP-UP 1: Email capture — 8s timer ──────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    if (localStorage.getItem("lumo_email_captured") === "true") return;
    const t = setTimeout(() => tryShow("email"), 8000);
    return () => clearTimeout(t);
  }, [mounted]);

  // ── POP-UP 2 + 3: Exit intent ────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY >= 20) return;
      if (activePopupRef.current !== null || cooldownRef.current) return;

      const hasItems = itemsRef.current.length > 0;

      if (hasItems && sessionStorage.getItem("lumo_cart_exit_shown") !== "true") {
        tryShow("cartExit");
      } else if (!hasItems && sessionStorage.getItem("lumo_exit_shown") !== "true") {
        tryShow("exit");
      }
    };

    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, [mounted]);

  // ── POP-UP 4: Cart idle — 90s no interaction ────────────────────────
  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) return;
    if (sessionStorage.getItem("lumo_cart_idle_shown") === "true") return;

    let timer: ReturnType<typeof setTimeout>;

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (window.location.pathname === "/checkout") return;
        tryShow("cartIdle");
      }, 90000);
    };

    const events = ["mousemove", "scroll", "click", "keypress"] as const;
    events.forEach((ev) => window.addEventListener(ev, reset));
    reset();

    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [mounted, items.length]);

  // ── POP-UP 5: BAC water reminder — 30s after injectable in cart ─────
  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) return;
    if (sessionStorage.getItem("lumo_bac_shown") === "true") return;

    // Resolve slugs for all cart items
    const cartSlugs = items.map((item) => {
      const product = PRODUCTS.find((p) => p.id.toString() === item.productId);
      return product?.slug ?? "";
    });

    const hasBacWater = cartSlugs.includes("bac-water");
    const hasInjectable = cartSlugs.some((slug) => slug && !noBAC.has(slug));

    if (hasBacWater || !hasInjectable) return;

    const t = setTimeout(() => {
      if (window.location.pathname === "/checkout") return;
      tryShow("bacWater");
    }, 30000);

    return () => clearTimeout(t);
  }, [mounted, items.length]);

  if (!mounted) return null;

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <>
      {activePopup === "email" && <EmailCapturePopup onClose={close} />}
      {activePopup === "exit" && <ExitIntentPopup onClose={close} />}
      {activePopup === "cartExit" && <CartExitPopup onClose={close} items={items} />}
      {activePopup === "cartIdle" && <CartIdlePopup onClose={close} itemCount={itemCount} />}
      {activePopup === "bacWater" && <BacWaterPopup onClose={close} />}
    </>
  );
}
