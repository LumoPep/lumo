import type { Metadata } from "next";
import { Fraunces, Newsreader, JetBrains_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FooterDisclaimer from "@/components/FooterDisclaimer";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import FloatingCartButton from "@/components/FloatingCartButton";
import ResearchGate from "@/components/ResearchGate";
import PopupManager from "@/components/popups/PopupManager";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300"],
  style: ["normal", "italic"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumo · Research Peptides",
  description:
    "Precision peptides for serious research. Synthesized to spec. Verified by an independent lab. Lot-traceable, documented, footnoted.",
  keywords:
    "research peptides, BPC-157, TB-500, peptide research, laboratory peptides, HPLC tested",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${newsreader.variable} ${jetbrainsMono.variable} ${interTight.variable}`}
    >
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
      </head>
      <body className="font-editorial">
        <ResearchGate />
        <AnnouncementBanner />
        <NavBar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
        <FooterDisclaimer />
        <CartDrawer />
        <FloatingCartButton />
        <Toast />
        <PopupManager />
      </body>
    </html>
  );
}
