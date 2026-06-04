"use server";

import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn, signOut } from "./auth";
import { hashPassword, isPasswordLongEnough, verifyPassword } from "./password";
import { sanitizeReturnUrl } from "@/lib/account/account-security";
import { redirect } from "next/navigation";
import { assertEmailLoginAllowed, LoginRateLimitError } from "./login-rate-limit";

export async function loginWithPassword(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const returnUrl = sanitizeReturnUrl(String(formData.get("returnUrl") || "/account"));

  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect("/login/error?reason=invalid-credentials");
  }

  if (!user.emailVerified) {
    redirect("/login/error?reason=email-not-verified");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: returnUrl
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login/error?reason=invalid-credentials");
    }

    throw error;
  }
}

export async function requestEmailRegistration(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const returnUrl = sanitizeReturnUrl(String(formData.get("returnUrl") || "/account"));

  if (!email.includes("@")) {
    redirect("/login/error?reason=invalid-email");
  }

  if (!isPasswordLongEnough(password)) {
    redirect("/login/error?reason=password-too-short");
  }

  if (password !== confirmPassword) {
    redirect("/login/error?reason=password-mismatch");
  }

  try {
    await assertEmailLoginAllowed(email);
  } catch (error) {
    if (error instanceof LoginRateLimitError) {
      redirect(`/login/error?reason=rate-limited&retryAfter=${error.retryAfterSeconds}`);
    }

    throw error;
  }

  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (existingUser?.emailVerified && existingUser.passwordHash) {
    redirect("/login/error?reason=account-exists");
  }

  const passwordHash = await hashPassword(password);

  await db.user.upsert({
    create: {
      email,
      passwordHash
    },
    update: {
      passwordHash
    },
    where: {
      email
    }
  });

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
