const defaultCooldownMs = 60_000;

export type LoginCooldownState = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export function getLoginCooldownState(
  lastRequestedAt: Date | null,
  now = new Date(),
  cooldownMs = defaultCooldownMs
): LoginCooldownState {
  if (!lastRequestedAt) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const elapsedMs = now.getTime() - lastRequestedAt.getTime();

  if (elapsedMs >= cooldownMs) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return {
    allowed: false,
    retryAfterSeconds: Math.ceil((cooldownMs - elapsedMs) / 1000)
  };
}

export function buildLoginCooldownMessage(retryAfterSeconds: number) {
  return `请求过于频繁，请 ${retryAfterSeconds} 秒后再试。`;
}
