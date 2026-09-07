"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles, Camera as Instagram, Heart } from 'lucide-react';
import { BRAND } from "@/lib/data";
import { staggerContainer, fadeInUp } from "@/lib/motion";

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();

  const footerItems = (
    Array.isArray(t.raw("footer")) ? t.raw("footer") : []
  ) as string[];

  function parseFooterItems(items: string[]) {
    const groups: Record<string, { label: string; href: string }[]> = {};
    const social: string[] = [];
    let copyright = "";

    for (const item of items) {
      if (item.startsWith("©")) {
        copyright = item;
      } else if (item.startsWith("Follow us")) {
        social.push(item.replace("Follow us — ", ""));
      } else {
        const [group, label] = item.split(" — ");
        if (group && label) {
          if (!groups[group]) groups[group] = [];
          groups[group].push({ label, href: "#" });
        }
      }
    }
    return { groups, social, copyright };
  }

  const { groups, social, copyright } = parseFooterItems(footerItems);

  function handleAnchorClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (pathname === "/" && href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5"
        >
          {/* Brand column */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]">
                <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-heading text-xl font-700 text-[var(--foreground)] tracking-tight">
                {BRAND.name}
              </span>
            </Link>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {social.map((s, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors duration-200"
                  aria-label={s}
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link groups */}
          {Object.entries(groups).map(([groupName, links]) => (
            <motion.div key={groupName} variants={fadeInUp}>
              <h3 className="mb-4 text-sm font-600 text-[var(--foreground)] uppercase tracking-wider">
                {groupName}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="text-xs text-[var(--muted-foreground)]">{copyright}</p>
          <p className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            {t("footer.madeWith")}
            <Heart className="h-3 w-3 text-[var(--primary)] fill-[var(--primary)]" aria-hidden="true" />
            {t("footer.forShoppers")}
          </p>
        </div>
      </div>
    </footer>
  );
}