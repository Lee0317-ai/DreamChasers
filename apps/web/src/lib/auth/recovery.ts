import { createHash, randomBytes } from "node:crypto";
import { isPasswordLongEnough } from "./password";

const passwordResetTokenBytes = 32;
const passwordResetTtlMs = 60 * 60 * 1000;

export type PasswordPairError = "password-too-short" | "password-mismatch";

export function normalizeAuthEmail(email: string) {
  return email.trim().toLowerCase();
}

export function buildPasswordResetIdentifier(email: string) {
  return `password-reset:${normalizeAuthEmail(email)}`;
}

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createPasswordResetToken(now = new Date()) {
  const plainToken = randomBytes(passwordResetTokenBytes).toString("hex");

  return {
    expires: new Date(now.getTime() + passwordResetTtlMs),
    hashedToken: hashPasswordResetToken(plainToken),
    plainToken
  };
}

export function validatePasswordPair(password: string, confirmPassword: string): PasswordPairError | null {
  if (!isPasswordLongEnough(password)) {
    return "password-too-short";
  }

  if (password !== confirmPassword) {
    return "password-mismatch";
  }

  return null;
}

export function getAuthBaseUrl(env: Record<string, string | undefined> = process.env) {
  return (env.AUTH_URL || env.NEXTAUTH_URL || env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}
