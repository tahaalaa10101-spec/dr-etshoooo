import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Dr.Etshoooo - Medical Education Platform",
    template: "%s | Dr.Etshoooo",
  },
  description: "Complete medical education platform for students. Study Anatomy, Histology, Physiology, Biochemistry with lectures, MCQs, clinical cases, and more.",
  keywords: ["medical education", "medical students", "anatomy", "histology", "physiology", "biochemistry", "MCQs", "clinical cases"],
  authors: [{ name: "Dr. Etshoooo" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dr.Etshoooo",
    title: "Dr.Etshoooo - Medical Education Platform",
    description: "Complete medical education platform for students.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Dr.Etshoooo - Medical Education Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr.Etshoooo - Medical Education Platform",
    description: "Complete medical education platform for students.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    "theme-color": "#0b1426",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg text-text-primary">
        <ThemeProvider><ErrorBoundary>{children}</ErrorBoundary></ThemeProvider>
      </body>
    </html>
  );
}
