"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Sparkles } from 'lucide-react';
import { useTranslations } from "next-intl";
import { navLinks } from "@/lib/data";
import { BRAND } from "@/lib/data";

interface NavbarProps {
  cartItemCount?: number;
}

export default function Navbar({ cartItemCount = 0 }: NavbarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navT = t.raw("nav") as Record<string, string>;

  function handleAnchorClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (pathname === "/" && href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  }

  function getLinkHref(href: string) {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]"
            >
              <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
            </motion.div>
            <span className="font-heading text-xl font-700 text-[var(--foreground)] tracking-tight">
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={getLinkHref(link.href)}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="relative px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-200 rounded-lg hover:bg-[var(--card)] group"
              >
                {navT[link.key] ?? link.label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--primary)] transition-colors duration-200"
              aria-label={`Shopping cart, ${cartItemCount} items`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-700 text-white"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>

            {/* Shop CTA */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:block"
            >
              <Link
                href="#product-grid"
                onClick={(e) => handleAnchorClick(e, "#product-grid")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-600 text-white hover:opacity-90 transition-opacity duration-200"
              >
                {t("nav.shopNow")}
              </Link>
            </motion.div>

            {/* Mobile menu toggle */}
            <button
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden border-t border-[var(--border)] bg-[var(--background)] overflow-hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={getLinkHref(link.href)}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="flex items-center px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] rounded-lg transition-colors duration-200"
                >
                  {navT[link.key] ?? link.label}
                </Link>
              ))}
              <Link
                href="#product-grid"
                onClick={(e) => handleAnchorClick(e, "#product-grid")}
                className="mt-2 flex items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-600 text-white"
              >
                {t("nav.shopNow")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}