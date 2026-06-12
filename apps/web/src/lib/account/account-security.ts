import { createHash, randomBytes } from "node:crypto";

export type CreditLedgerEntry = {
  amount: number;
  type: "grant" | "usage" | "adjustment" | "refund";
};

export const starterPlatformCredits = 20;
export const starterPlatformCreditNote = "starter_platform_credits";

type ProductSessionRequest = {
  productSlug: string;
  registeredProductSlugs: string[];
  returnUrl: string;
};

export function sanitizeReturnUrl(value: string | null | undefined) {
  if (!value) {
    return "/account";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/account";
  }

  return value;
}

export function hashPlatformApiKey(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function generatePlatformApiKeySecret() {
  return `dc_live_${randomBytes(24).toString("hex")}`;
}

export function buildApiKeyHint(secret: string) {
  if (secret.length <= 8) {
    return "****";
  }

  return `${secret.slice(0, 4)}...${secret.slice(-4)}`;
}

export function computeCreditBalance(entries: CreditLedgerEntry[]) {
  return entries.reduce((sum, entry) => sum + entry.amount, 0);
}

export function shouldGrantStarterPlatformCredits(existingLedgerEntryCount: number) {
  return existingLedgerEntryCount === 0;
}

export function canCreateProductSession({
  productSlug,
  registeredProductSlugs,
  returnUrl
}: ProductSessionRequest) {
  return registeredProductSlugs.includes(productSlug) && sanitizeReturnUrl(returnUrl) === returnUrl;
}
