export interface NavLink {
  label: string;
  href: string;
  key: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "Products", href: "#product-grid", key: "products" },
  { label: "Categories", href: "#category-filter", key: "categories" },
  { label: "Deals", href: "#newsletter", key: "deals" },
];

export const BRAND = {
  name: "Nova Shop",
  tagline: "Bold products. Better prices.",
  ctaHref: "#product-grid",
} as const;

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  original_price: string | null;
  category: string;
  image_url: string | null;
  rating: string | null;
  review_count: number | null;
  is_on_sale: boolean;
  stock: number;
  created_at: string;
};