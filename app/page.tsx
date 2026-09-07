"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Truck, RotateCcw, Shield, Sparkles, BadgePercent, Gift, ChevronRight, Heart, Eye, Check, Mail, ArrowRight, Zap } from 'lucide-react';
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, scaleIn } from "@/lib/motion";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];

const FILTER_CATEGORIES = [
  "All",
  "Electronics & Gadgets",
  "Fashion & Apparel",
  "Beauty & Skincare",
  "Home & Living",
  "Sports & Outdoors",
] as const;
type FilterCategory = (typeof FILTER_CATEGORIES)[number];

const VALUE_ICONS = [Truck, RotateCcw, Shield, Sparkles, BadgePercent, Gift];

const CATEGORY_SLUGS = [
  "electronics-gadgets-collection",
  "fashion-apparel-collection",
  "beauty-skincare-collection",
  "home-living-collection",
  "sports-outdoors-collection",
];

const HERO_IMAGES = [
  "/images/wireless-noise-cancelling-headphones.jpg",
  "/images/minimalist-leather-watch.jpg",
  "/images/premium-skincare-serum.jpg",
  "/images/modern-running-sneakers.jpg",
];

function StarRating({ rating, count }: { rating: number; count: number }) {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={cn(
              "h-3.5 w-3.5",
              s <= Math.round(rating)
                ? "fill-[var(--accent)] text-[var(--accent)]"
                : "fill-transparent text-neutral-600"
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="text-xs text-[var(--muted-foreground)]">
        ({count} {t("products.reviews_suffix")})
      </span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const t = useTranslations();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const price = parseFloat(product.price);
  const originalPrice = product.original_price
    ? parseFloat(product.original_price)
    : null;
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;
  const rating = product.rating ? parseFloat(product.rating) : null;

  const handleAdd = () => {
    if (product.stock === 0) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const imageSrc = product.image_url
    ? product.image_url
    : "/images/" + product.name.toLowerCase().replace(/\s+/g, "-") + ".jpg";

  return (
    <motion.article
      variants={scaleIn}
      className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.12),0_8px_24px_-8px_rgba(0,0,0,0.28)] transition-shadow duration-300 hover:shadow-[0_4px_8px_rgba(0,0,0,0.18),0_16px_40px_-12px_rgba(0,0,0,0.40)]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--background)]">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/14182bb4681847f1a48f9ec99db9ab8e.jpg";
          }}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_on_sale && discount && (
            <span className="rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-semibold text-black">
              -{discount}% {t("products.off_label")}
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-semibold text-white">
              {t("products.out_of_stock")}
            </span>
          )}
        </div>
        <button
          onClick={() => setWishlisted((w) => !w)}
          aria-label={wishlisted ? t("products.wishlist_remove") : t("products.wishlist_add")}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--card)]/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              wishlisted ? "fill-rose-500 text-rose-500" : "text-[var(--muted-foreground)]"
            )}
            aria-hidden="true"
          />
        </button>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-black/60 py-3 transition-transform duration-300 group-hover:translate-y-0">
          <button className="flex items-center gap-1.5 text-sm font-medium text-white">
            <Eye className="h-4 w-4" aria-hidden="true" />
            {t("products.quick_view")}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
          {product.category}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--foreground)]">
          {product.name}
        </h3>
        {product.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
            {product.description}
          </p>
        )}
        {rating !== null && product.review_count !== null && (
          <StarRating rating={rating} count={product.review_count} />
        )}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[var(--foreground)]">
              ${price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-[var(--muted-foreground)] line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            aria-label={t("products.add_to_cart") + " " + product.name}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]",
              product.stock === 0
                ? "cursor-not-allowed bg-[var(--border)] text-[var(--muted-foreground)]"
                : added
                ? "bg-green-500 text-white"
                : "bg-[var(--accent)] text-black hover:scale-110 hover:brightness-105"
            )}
          >
            {added ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
      <div className="aspect-[4/3] bg-[var(--border)]" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 rounded bg-[var(--border)]" />
        <div className="h-4 w-3/4 rounded bg-[var(--border)]" />
        <div className="h-3 w-full rounded bg-[var(--border)]" />
        <div className="h-3 w-2/3 rounded bg-[var(--border)]" />
        <div className="flex justify-between pt-2">
          <div className="h-5 w-16 rounded bg-[var(--border)]" />
          <div className="h-9 w-9 rounded-full bg-[var(--border)]" />
        </div>
      </div>
    </div>
  );
}

function TestimonialCard(props: {
  name: string;
  location: string;
  rating: number;
  text: string;
  delay: number;
}) {
  const { name, location, rating, text, delay } = props;
  return (
    <Reveal delay={delay} className="flex">
      <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.12),0_8px_24px_-8px_rgba(0,0,0,0.24)]">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={cn(
                "h-4 w-4",
                s <= rating
                  ? "fill-[var(--accent)] text-[var(--accent)]"
                  : "fill-transparent text-[var(--border)]"
              )}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="flex-1 text-sm leading-relaxed text-[var(--foreground)]">
          &ldquo;{text}&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)]/20 text-sm font-bold text-[var(--accent)]">
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{name}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{location}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function HomePage() {
  const t = useTranslations();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");

  useEffect(() => {
    const supabase = createClient();
    void (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    })();
  }, []);

  const filteredProducts = useMemo(
    () =>
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  );

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setSubscribed(true);
    },
    [email]
  );

  const valueItems = (
    Array.isArray(t.raw("values.items")) ? t.raw("values.items") : []
  ) as { title: string; desc: string }[];

  const stats = (
    Array.isArray(t.raw("social_proof.stats")) ? t.raw("social_proof.stats") : []
  ) as { value: string; label: string }[];

  const testimonials = (
    Array.isArray(t.raw("social_proof.testimonials"))
      ? t.raw("social_proof.testimonials")
      : []
  ) as { name: string; location: string; rating: number; text: string }[];

  return (
    <main className="flex flex-col">
      <Reveal>
        <section
          id="home"
          className="relative overflow-hidden bg-[var(--background)] px-4 pb-24 pt-28 md:pb-32 md:pt-36"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-[600px] w-[900px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5"
            >
              <Zap className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
              <span className="text-xs font-medium text-[var(--muted-foreground)]">
                {t("hero.eyebrow")}
              </span>
            </motion.div>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className="text-balance text-5xl font-extrabold leading-[1.08] tracking-tight text-[var(--foreground)] md:text-6xl lg:text-7xl"
                >
                  {t("hero.title")}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg"
                >
                  {t("hero.subtitle")}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  <a
                    href="#products"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                  >
                    {t("hero.cta_primary")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#categories"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-all duration-200 hover:border-[var(--primary)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]"
                  >
                    {t("hero.cta_secondary")}
                  </a>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="mt-10 flex flex-wrap gap-5"
                >
                  {[
                    { icon: Truck, label: t("hero.badge_free") },
                    { icon: RotateCcw, label: t("hero.badge_returns") },
                    { icon: Shield, label: t("hero.badge_support") },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                      <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                className="hidden lg:grid grid-cols-2 gap-3"
                aria-hidden="true"
              >
                {HERO_IMAGES.map((src, i) => (
                  <div
                    key={i}
                    className={cn(
                      "overflow-hidden rounded-2xl border border-[var(--border)]",
                      i === 0 ? "col-span-2 aspect-[16/7]" : "aspect-square"
                    )}
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover opacity-80"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          id="categories"
          className="bg-[var(--card)] px-4 py-20 border-t border-[var(--border)]"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
                {t("categories.heading")}
              </h2>
              <p className="mt-3 text-base text-[var(--muted-foreground)]">
                {t("categories.subheading")}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5">
              {FILTER_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]",
                    activeCategory === cat
                      ? "border-[var(--accent)] bg-[var(--accent)] text-black shadow-sm"
                      : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-[var(--accent)]/40 hover:text-[var(--foreground)]"
                  )}
                >
                  {cat === "All" ? t("categories.filter_all") : cat}
                </button>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {FILTER_CATEGORIES.filter((c) => c !== "All").map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
                    activeCategory === cat
                      ? "border-[var(--accent)]"
                      : "border-transparent hover:border-[var(--accent)]/30"
                  )}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-[var(--border)]">
                    <img
                      src={"/images/" + CATEGORY_SLUGS[i] + ".jpg"}
                      alt={cat}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3">
                    <span className="text-left text-xs font-semibold leading-tight text-white">
                      {cat}
                    </span>
                  </div>
                  {activeCategory === cat && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)]">
                      <Check className="h-3 w-3 text-black" aria-hidden="true" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          id="products"
          className="bg-[var(--background)] px-4 py-20 border-t border-[var(--border)]"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
                  {t("products.heading")}
                </h2>
                <p className="mt-2 text-base text-[var(--muted-foreground)]">
                  {t("products.subheading")}
                </p>
              </div>
              {activeCategory !== "All" && (
                <button
                  onClick={() => setActiveCategory("All")}
                  className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  {t("products.view_all")}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <ShoppingCart className="mb-4 h-12 w-12 text-[var(--border)]" aria-hidden="true" />
                <p className="text-base text-[var(--muted-foreground)]">{t("products.empty")}</p>
                <button
                  onClick={() => setActiveCategory("All")}
                  className="mt-4 text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  {t("categories.filter_all")}
                </button>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          id="deals"
          className="bg-[var(--card)] px-4 py-20 border-t border-[var(--border)]"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
                {t("values.heading")}
              </h2>
              <p className="mt-3 text-base text-[var(--muted-foreground)]">
                {t("values.subheading")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {valueItems.map((item, i) => {
                const Icon = VALUE_ICONS[i] ?? Sparkles;
                return (
                  <Reveal key={i} delay={i * 0.07}>
                    <div className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 transition-colors duration-200 hover:border-[var(--primary)]/30">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/15">
                        <Icon className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--foreground)]">{item.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">{item.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-[var(--background)] px-4 py-20 border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="text-center">
                    <p className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] md:text-5xl">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
                {t("social_proof.heading")}
              </h2>
              <p className="mt-3 text-base text-[var(--muted-foreground)]">
                {t("social_proof.subheading")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard
                  key={i}
                  name={testimonial.name}
                  location={testimonial.location}
                  rating={testimonial.rating}
                  text={testimonial.text}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          id="newsletter"
          className="relative overflow-hidden bg-[var(--primary)] px-4 py-20"
        >
          <div className="relative mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
              {t("newsletter.eyebrow")}
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {t("newsletter.heading")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              {t("newsletter.subheading")}
            </p>

            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 flex flex-col items-center gap-3"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                    <Check className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <p className="text-lg font-bold text-white">{t("newsletter.success_heading")}</p>
                  <p className="text-sm text-white/70">{t("newsletter.success_body")}</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubscribe}
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    {t("newsletter.placeholder")}
                  </label>
                  <div className="relative flex-1">
                    <Mail
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
                      aria-hidden="true"
                    />
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("newsletter.placeholder")}
                      className="w-full rounded-full border border-white/20 bg-white/15 py-3 pl-11 pr-4 text-sm text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--primary)] transition-all duration-200 hover:bg-white/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)]"
                  >
                    {t("newsletter.cta")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-4 text-xs text-white/40">{t("newsletter.disclaimer")}</p>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
