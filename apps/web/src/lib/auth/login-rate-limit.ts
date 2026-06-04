import { db } from "../db";
import { buildLoginCooldownMessage, getLoginCooldownState } from "./login-rate-limit-rules";

export class LoginRateLimitError extends Error {
  retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super(buildLoginCooldownMessage(retryAfterSeconds));
    this.name = "LoginRateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export async function assertEmailLoginAllowed(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await db.emailLoginRequest.findUnique({
    where: { email: normalizedEmail }
  });
  const cooldown = getLoginCooldownState(existing?.lastRequestedAt ?? null);

  if (!cooldown.allowed) {
    throw new LoginRateLimitError(cooldown.retryAfterSeconds);
  }

  await db.emailLoginRequest.upsert({
    create: {
      email: normalizedEmail,
      lastRequestedAt: new Date()
    },
    update: {
      lastRequestedAt: new Date(),
      requestCount: {
        increment: 1
      }
    },
    where: { email: normalizedEmail }
  });
}
