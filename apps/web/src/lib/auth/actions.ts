"use server";

import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { auth, signIn, signOut } from "./auth";
import { hashPassword, isPasswordLongEnough, verifyPassword } from "./password";
import { sanitizeReturnUrl } from "@/lib/account/account-security";
import { redirect } from "next/navigation";
import { assertEmailLoginAllowed, LoginRateLimitError } from "./login-rate-limit";
import { sendPasswordResetEmail } from "./email-login";
import {
  buildPasswordResetIdentifier,
  createPasswordResetToken,
  getAuthBaseUrl,
  hashPasswordResetToken,
  normalizeAuthEmail,
  validatePasswordPair
} from "./recovery";

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

export async function requestPasswordReset(formData: FormData) {
  const email = normalizeAuthEmail(String(formData.get("email") || ""));

  if (!email.includes("@")) {
    redirect("/login/error?reason=invalid-email");
  }

  try {
    await assertEmailLoginAllowed(email);
  } catch (error) {
    if (error instanceof LoginRateLimitError) {
      redirect(`/login/error?reason=rate-limited&retryAfter=${error.retryAfterSeconds}`);
    }

    throw error;
  }

  const user = await db.user.findUnique({
    where: { email }
  });

  if (user) {
    const resetToken = createPasswordResetToken();
    const identifier = buildPasswordResetIdentifier(email);

    await db.verificationToken.deleteMany({
      where: { identifier }
    });
    await db.verificationToken.create({
      data: {
        expires: resetToken.expires,
        identifier,
        token: resetToken.hashedToken
      }
    });

    const resetUrl = `${getAuthBaseUrl()}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken.plainToken)}`;

    await sendPasswordResetEmail({
      siteName: "DreamChasers",
      to: email,
      url: resetUrl
    });
  }

  redirect("/login/check-email?mode=password-reset");
}

export async function completePasswordReset(formData: FormData) {
  const email = normalizeAuthEmail(String(formData.get("email") || ""));
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const passwordError = validatePasswordPair(password, confirmPassword);

  if (!email.includes("@") || !token) {
    redirect("/login/error?reason=reset-token-invalid");
  }

  if (passwordError) {
    redirect(`/login/error?reason=${passwordError}`);
  }

  const identifier = buildPasswordResetIdentifier(email);
  const hashedToken = hashPasswordResetToken(token);
  const resetRecord = await db.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier,
        token: hashedToken
      }
    }
  });

  if (!resetRecord || resetRecord.expires < new Date()) {
    if (resetRecord) {
      await db.verificationToken.delete({
        where: {
          identifier_token: {
            identifier,
            token: hashedToken
          }
        }
      });
    }

    redirect("/login/error?reason=reset-token-invalid");
  }

  await db.user.update({
    data: {
      passwordHash: await hashPassword(password)
    },
    where: { email }
  });
  await db.verificationToken.delete({
    where: {
      identifier_token: {
        identifier,
        token: hashedToken
      }
    }
  });

  redirect("/login/error?reason=password-updated");
}

export async function changeCurrentPassword(formData: FormData) {
  const session = await auth();
  const email = normalizeAuthEmail(session?.user?.email || "");
  const currentPassword = String(formData.get("currentPassword") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const passwordError = validatePasswordPair(password, confirmPassword);

  if (!email) {
    redirect("/login?returnUrl=/account/security");
  }

  if (passwordError) {
    redirect(`/login/error?reason=${passwordError}`);
  }

  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    redirect("/login/error?reason=current-password-invalid");
  }

  await db.user.update({
    data: {
      passwordHash: await hashPassword(password)
    },
    where: { email }
  });

  redirect("/login/error?reason=password-updated");
}

export async function resendVerificationEmail(formData: FormData) {
  const email = normalizeAuthEmail(String(formData.get("email") || ""));
  const returnUrl = sanitizeReturnUrl(String(formData.get("returnUrl") || "/account"));

  if (!email.includes("@")) {
    redirect("/login/error?reason=invalid-email");
  }

  try {
    await assertEmailLoginAllowed(email);
  } catch (error) {
    if (error instanceof LoginRateLimitError) {
      redirect(`/login/error?reason=rate-limited&retryAfter=${error.retryAfterSeconds}`);
    }

    throw error;
  }

  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user || user.emailVerified) {
    redirect("/login/check-email?mode=verification");
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
