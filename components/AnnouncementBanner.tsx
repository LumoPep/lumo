"use client";

export default function AnnouncementBanner() {
  return (
    <div
      id="announcement-banner"
      className="w-full bg-clay flex items-center justify-center"
      style={{ height: "36px" }}
    >
      <span
        className="font-mono uppercase text-cream text-center px-4"
        style={{ fontSize: "11px", letterSpacing: "2px" }}
      >
        <span style={{ color: "rgba(245,239,228,0.9)" }}>⚠</span>
        <span className="sm:hidden"> FOR RESEARCH USE ONLY</span>
        <span className="hidden sm:inline"> FOR RESEARCH USE ONLY — NOT FOR HUMAN OR VETERINARY USE — MUST BE 21+ — NOT A DRUG OR SUPPLEMENT</span>
      </span>
    </div>
  );
}
