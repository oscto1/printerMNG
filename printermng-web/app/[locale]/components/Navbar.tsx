"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const t = useTranslations("common");

    const isActive = (path: string) => {
        const firstSegment = pathname.split("/").filter(Boolean)[1] || "";
        const targetSegment = path.split("/").filter(Boolean)[0] || "";
        return firstSegment === targetSegment;
    };

    const navLinkClasses = (path: string) =>
        `block px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
            isActive(path)
              ? "bg-white shadow-sm"
              : "hover:bg-gray-300"
        }`;

    return (
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <nav className="relative flex items-center justify-between rounded-full bg-gray-200 px-4 py-2">
          
          {/* Title on the left */}
          <div className="flex items-center px-4">
            <a href="/home" className="text-gray-700 font-bold">PrinterMNG</a>
          </div>

          {/* Desktop navigation on the right */}
          <div className="hidden items-center gap-1.5 md:flex">
            <Link  href="/printers" className={navLinkClasses("/printers") + " text-gray-700"}>
              {t("printers")}
            </Link>

            <Link href="/clients" className={navLinkClasses("/clients") + " text-gray-700"}>
              {t("clients")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full p-2 text-gray-700 hover:bg-gray-300 transition-colors md:hidden focus:outline-none ml-auto"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Mobile navigation dropdown */}
          {isOpen && (
            <div className="absolute inset-x-4 top-16 rounded-2xl border border-gray-300 bg-gray-200 p-3 shadow-xl md:hidden z-50">
              <div className="flex flex-col gap-1">
                <Link
                  href="/printers"
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-base font-medium text-gray-700 transition-colors ${
                    isActive("/printers") ? "bg-white shadow-sm" : "hover:bg-gray-300"
                  }`}
                >
                  {t("printers")}
                </Link>

                <Link
                  href="/clients"
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-base font-medium text-gray-700 transition-colors ${
                    isActive("/clients") ? "bg-white shadow-sm" : "hover:bg-gray-300"
                  }`}
                >
                  {t("clients")}
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    );
}