import { createHash, randomBytes } from "node:crypto";

export const productSessionTtlMs = 10 * 60 * 1000;

export const defaultProducts = [
  {
    name: "拾光 TimePick",
    slug: "timepick"
  },
  {
    name: "镜界 Wonderland",
    slug: "wonderland"
  }
] as const;

export type ProductSlug = (typeof defaultProducts)[number]["slug"];

export function isRegisteredProductSlug(value: string): value is ProductSlug {
  return defaultProducts.some((product) => product.slug === value);
}

export function generateProductSessionToken() {
  return `dc_product_${randomBytes(24).toString("hex")}`;
}

export function hashProductSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function buildProductSessionExpiry(now = new Date()) {
  return new Date(now.getTime() + productSessionTtlMs);
}

export function canConsumeProductSession({
  consumedAt,
  expiresAt,
  now = new Date(),
  productSlug,
  requestedProductSlug
}: {
  consumedAt: Date | null;
  expiresAt: Date;
  now?: Date;
  productSlug: string;
  requestedProductSlug: string;
}) {
  return !consumedAt && expiresAt.getTime() > now.getTime() && productSlug === requestedProductSlug;
}
