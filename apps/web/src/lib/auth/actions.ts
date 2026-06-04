"use server";

import { signIn, signOut } from "./auth";
import { sanitizeReturnUrl } from "@/lib/account/account-security";
import { redirect } from "next/navigation";
import { assertEmailLoginAllowed, LoginRateLimitError } from "./login-rate-limit";

export async function requestEmailLogin(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const returnUrl = sanitizeReturnUrl(String(formData.get("returnUrl") || "/account"));

  try {
    await assertEmailLoginAllowed(email);
  } catch (error) {
    if (error instanceof LoginRateLimitError) {
      redirect(`/login/error?reason=rate-limited&retryAfter=${error.retryAfterSeconds}`);
    }

    throw error;
  }

  await signIn("nodemailer", {
    email,
    redirectTo: returnUrl
  });
}

export async function signOutCurrentUser() {
  await signOut({
    redirectTo: "/login"
  });
}
