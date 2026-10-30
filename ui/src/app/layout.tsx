import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import { SessionProvider } from "@/context/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Salary Manager",
  description: "Manage ACME employee salaries",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <Provider>
          {/* The session read is request-time data, so with Cache Components it must sit behind Suspense. */}
          <Suspense fallback={<p className="p-8 text-sm text-zinc-500">Loading…</p>}>
            <SessionProvider>{children}</SessionProvider>
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}
