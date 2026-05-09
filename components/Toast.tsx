"use client";

import { useEffect, useState } from "react";

let showToastFn: ((message: string) => void) | null = null;

export function showToast(message: string) {
  if (showToastFn) {
    showToastFn(message);
  }
}

export default function Toast() {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    showToastFn = (msg: string) => {
      setMessage(msg);
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    return () => {
      showToastFn = null;
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="bg-ink text-bone hairline-border p-4 flex items-center space-x-3 min-w-[300px]">
        <span className="text-clay">●</span>
        <p className="font-mono text-xs uppercase tracking-mono">{message}</p>
      </div>
    </div>
  );
}
