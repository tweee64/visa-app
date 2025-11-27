import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Navigation } from "~/components/layout/Navigation";

export const metadata: Metadata = {
  title: "Vietnam Visa Application Service",
  description: "Fast and reliable Vietnam visa application processing. Apply online for your Vietnam tourist, business, or transit visa with expert assistance.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen bg-white">
        <TRPCReactProvider>
          <Navigation />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
