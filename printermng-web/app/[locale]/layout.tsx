import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ErrorProvider } from "./context/ErrorContext";
import { NextIntlClientProvider } from "next-intl";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "PrinterMNG | ASP.NET Core Demo",
  description: "C# ASP.NET Printer Management Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextIntlClientProvider>
      <ErrorProvider>
        <html lang="en" className={`${roboto.variable} ${roboto.variable} h-full`}>
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
      </ErrorProvider>
    </NextIntlClientProvider>
  );
}
