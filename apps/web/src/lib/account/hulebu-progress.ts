import { db } from "@/lib/db";

export type HulebuProgressRecord = {
  bankedCoins: number;
  bestEndlessLayer: number;
  bestAscensionLevel: number;
  dailyBestLevels: Record<string, number>;
  dailyStreak: number;
  lastDailySeed: string | null;
  achievements: Record<string, string>;
  upgrades: Record<string, number>;
  routeProgress: Record<string, number>;
  preferredRoute: string | null;
  equippedAscensionLoadout: string[];
  unlockedAscensionPerks: Record<string, boolean>;
  activeRun: Record<string, unknown> | null;
};

type StoredHulebuProgress = {
  achievements: unknown;
  activeRun: unknown;
  bankedCoins: number;
  bestAscensionLevel: number;
  bestEndlessLayer: number;
  dailyBestLevels: unknown;
  dailyStreak: number;
  lastDailySeed: string | null;
  upgrades: unknown;
  routeProgress: unknown;
  preferredRoute: string | null;
  equippedAscensionLoadout: unknown;
  unlockedAscensionPerks: unknown;
  userId: string;
};

const hulebuProgressTable = (db as unknown as {
  hulebuProgress: {
    findUnique(args: { where: { userId: string } }): Promise<StoredHulebuProgress | null>;
    upsert(args: {
      create: StoredHulebuProgress;
      update: Omit<StoredHulebuProgress, "userId">;
      where: { userId: string };
    }): Promise<StoredHulebuProgress>;
  };
}).hulebuProgress;

const DEFAULT_HULEBU_PROGRESS: HulebuProgressRecord = {
  bankedCoins: 0,
  bestEndlessLayer: 0,
  bestAscensionLevel: 1,
  dailyBestLevels: {},
  dailyStreak: 0,
  lastDailySeed: null,
  achievements: {},
  upgrades: {},
  routeProgress: {},
  preferredRoute: null,
  equippedAscensionLoadout: [],
  unlockedAscensionPerks: {},
  activeRun: null,
};

function sanitizeDailyBestLevels(input: unknown): Record<string, number> {
  if (!input || typeof input !== "object") return {};
  return Object.fromEntries(
    Object.entries(input).flatMap(([key, value]) =>
      Number.isFinite(value) ? [[key, Math.max(0, Number(value))]] : [],
    ),
  );
}

function sanitizeAchievements(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object") return {};
  return Object.fromEntries(
    Object.entries(input).flatMap(([key, value]) =>
      typeof value === "string" && value ? [[key, value]] : [],
    ),
  );
}

function sanitizeNumericMap(input: unknown): Record<string, number> {
  if (!input || typeof input !== "object") return {};
  return Object.fromEntries(
    Object.entries(input).flatMap(([key, value]) =>
      Number.isFinite(value) ? [[key, Math.max(0, Math.min(2, Number(value)))]] : [],
    ),
  );
}

function sanitizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.flatMap((value) => (typeof value === "string" && value ? [value] : []));
}

function sanitizeBooleanMap(input: unknown): Record<string, boolean> {
  if (!input || typeof input !== "object") return {};
  return Object.fromEntries(
    Object.entries(input).flatMap(([key, value]) => (key && Boolean(value) ? [[key, true]] : [])),
  );
}

function sanitizeActiveRun(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object") return null;
  const activeRun = input as Record<string, unknown>;
  if (typeof activeRun.sessionKey !== "string" || !activeRun.sessionKey) return null;
  if (typeof activeRun.updatedAt !== "string" || !activeRun.updatedAt) return null;
  return activeRun;
}

function pickLatestActiveRun(
  accountActiveRun: Record<string, unknown> | null,
  localActiveRun: Record<string, unknown> | null,
) {
  if (!accountActiveRun) return localActiveRun;
  if (!localActiveRun) return accountActiveRun;
  const accountTime = Date.parse(String(accountActiveRun.updatedAt ?? ""));
  const localTime = Date.parse(String(localActiveRun.updatedAt ?? ""));
  if (!Number.isFinite(accountTime)) return localActiveRun;
  if (!Number.isFinite(localTime)) return accountActiveRun;
  return localTime >= accountTime ? localActiveRun : accountActiveRun;
}

function sanitizeProgress(input?: Partial<HulebuProgressRecord> | null): HulebuProgressRecord {
  return {
    bankedCoins: Number.isFinite(input?.bankedCoins) ? Math.max(0, Number(input?.bankedCoins)) : 0,
    bestEndlessLayer: Number.isFinite(input?.bestEndlessLayer) ? Math.max(0, Number(input?.bestEndlessLayer)) : 0,
    bestAscensionLevel: Number.isFinite(input?.bestAscensionLevel) ? Math.max(1, Math.min(4, Number(input?.bestAscensionLevel))) : 1,
    dailyBestLevels: sanitizeDailyBestLevels(input?.dailyBestLevels),
    dailyStreak: Number.isFinite(input?.dailyStreak) ? Math.max(0, Number(input?.dailyStreak)) : 0,
    lastDailySeed: typeof input?.lastDailySeed === "string" ? input.lastDailySeed : null,
    achievements: sanitizeAchievements(input?.achievements),
    upgrades: sanitizeNumericMap(input?.upgrades),
    routeProgress: sanitizeDailyBestLevels(input?.routeProgress),
    preferredRoute: typeof input?.preferredRoute === "string" && input.preferredRoute ? input.preferredRoute : null,
    equippedAscensionLoadout: sanitizeStringArray(input?.equippedAscensionLoadout),
    unlockedAscensionPerks: sanitizeBooleanMap(input?.unlockedAscensionPerks),
    activeRun: sanitizeActiveRun(input?.activeRun),
  };
}

export function mergeHulebuProgress(
  accountProgress?: Partial<HulebuProgressRecord> | null,
  localProgress?: Partial<HulebuProgressRecord> | null,
): HulebuProgressRecord {
  const account = sanitizeProgress(accountProgress);
  const local = sanitizeProgress(localProgress);
  const hasIncomingActiveRun = Object.prototype.hasOwnProperty.call(localProgress ?? {}, "activeRun");

  return {
    bankedCoins: Math.max(account.bankedCoins, local.bankedCoins),
    bestEndlessLayer: Math.max(account.bestEndlessLayer, local.bestEndlessLayer),
    bestAscensionLevel: Math.max(account.bestAscensionLevel, local.bestAscensionLevel),
    dailyBestLevels: {
      ...account.dailyBestLevels,
      ...Object.fromEntries(
        Object.entries(local.dailyBestLevels).map(([key, value]) => [
          key,
          Math.max(value, account.dailyBestLevels[key] ?? 0),
        ]),
      ),
    },
    achievements: {
      ...account.achievements,
      ...local.achievements,
    },
    dailyStreak: Math.max(account.dailyStreak, local.dailyStreak),
    lastDailySeed: local.lastDailySeed ?? account.lastDailySeed,
    upgrades: {
      ...account.upgrades,
      ...Object.fromEntries(
        Object.entries(local.upgrades).map(([key, value]) => [
          key,
          Math.max(value, account.upgrades[key] ?? 0),
        ]),
      ),
    },
    routeProgress: {
      ...account.routeProgress,
      ...Object.fromEntries(
        Object.entries(local.routeProgress).map(([key, value]) => [
          key,
          Math.max(value, account.routeProgress[key] ?? 0),
        ]),
      ),
    },
    preferredRoute: local.preferredRoute ?? account.preferredRoute,
    equippedAscensionLoadout:
      local.equippedAscensionLoadout.length > 0 ? local.equippedAscensionLoadout : account.equippedAscensionLoadout,
    unlockedAscensionPerks: {
      ...account.unlockedAscensionPerks,
      ...local.unlockedAscensionPerks,
    },
    activeRun: hasIncomingActiveRun ? local.activeRun : pickLatestActiveRun(account.activeRun, local.activeRun),
  };
}

export async function getHulebuProgressByEmail(email: string) {
  const user = await db.user.findUnique({
    select: {
      id: true,
    },
    where: { email },
  });

  if (!user) {
    return DEFAULT_HULEBU_PROGRESS;
  }

  const progress = await hulebuProgressTable.findUnique({
    where: { userId: user.id },
  });

  if (!progress) {
    return DEFAULT_HULEBU_PROGRESS;
  }

  return sanitizeProgress({
    achievements: progress.achievements as Record<string, string>,
    bankedCoins: progress.bankedCoins,
    bestAscensionLevel: progress.bestAscensionLevel,
    bestEndlessLayer: progress.bestEndlessLayer,
    dailyBestLevels: progress.dailyBestLevels as Record<string, number>,
    dailyStreak: progress.dailyStreak,
    lastDailySeed: progress.lastDailySeed,
    upgrades: progress.upgrades as Record<string, number>,
    routeProgress: progress.routeProgress as Record<string, number>,
    preferredRoute: progress.preferredRoute,
    equippedAscensionLoadout: progress.equippedAscensionLoadout as string[],
    unlockedAscensionPerks: progress.unlockedAscensionPerks as Record<string, boolean>,
    activeRun: progress.activeRun as Record<string, unknown> | null,
  });
}

export async function upsertHulebuProgressByEmail(email: string, progress: Partial<HulebuProgressRecord>) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("账号不存在，请重新登录。");
  }

  const existing = await hulebuProgressTable.findUnique({
    where: { userId: user.id },
  });
  const merged = mergeHulebuProgress(
    existing
      ? {
          achievements: existing.achievements as Record<string, string>,
          bankedCoins: existing.bankedCoins,
          bestAscensionLevel: existing.bestAscensionLevel,
          bestEndlessLayer: existing.bestEndlessLayer,
          dailyBestLevels: existing.dailyBestLevels as Record<string, number>,
          dailyStreak: existing.dailyStreak,
          lastDailySeed: existing.lastDailySeed,
          upgrades: existing.upgrades as Record<string, number>,
          routeProgress: existing.routeProgress as Record<string, number>,
          preferredRoute: existing.preferredRoute,
          equippedAscensionLoadout: existing.equippedAscensionLoadout as string[],
          unlockedAscensionPerks: existing.unlockedAscensionPerks as Record<string, boolean>,
          activeRun: existing.activeRun as Record<string, unknown> | null,
        }
      : null,
    progress,
  );

  const saved = await hulebuProgressTable.upsert({
    create: {
      achievements: merged.achievements,
      bankedCoins: merged.bankedCoins,
      bestAscensionLevel: merged.bestAscensionLevel,
      bestEndlessLayer: merged.bestEndlessLayer,
      dailyBestLevels: merged.dailyBestLevels,
      dailyStreak: merged.dailyStreak,
      lastDailySeed: merged.lastDailySeed,
      upgrades: merged.upgrades,
      routeProgress: merged.routeProgress,
      preferredRoute: merged.preferredRoute,
      equippedAscensionLoadout: merged.equippedAscensionLoadout,
      unlockedAscensionPerks: merged.unlockedAscensionPerks,
      activeRun: merged.activeRun,
      userId: user.id,
    },
    update: {
      achievements: merged.achievements,
      bankedCoins: merged.bankedCoins,
      bestAscensionLevel: merged.bestAscensionLevel,
      bestEndlessLayer: merged.bestEndlessLayer,
      dailyBestLevels: merged.dailyBestLevels,
      dailyStreak: merged.dailyStreak,
      lastDailySeed: merged.lastDailySeed,
      upgrades: merged.upgrades,
      routeProgress: merged.routeProgress,
      preferredRoute: merged.preferredRoute,
      equippedAscensionLoadout: merged.equippedAscensionLoadout,
      unlockedAscensionPerks: merged.unlockedAscensionPerks,
      activeRun: merged.activeRun,
    },
    where: { userId: user.id },
  });

  return sanitizeProgress({
    achievements: saved.achievements as Record<string, string>,
    bankedCoins: saved.bankedCoins,
    bestAscensionLevel: saved.bestAscensionLevel,
    bestEndlessLayer: saved.bestEndlessLayer,
    dailyBestLevels: saved.dailyBestLevels as Record<string, number>,
    dailyStreak: saved.dailyStreak,
    lastDailySeed: saved.lastDailySeed,
    upgrades: saved.upgrades as Record<string, number>,
    routeProgress: saved.routeProgress as Record<string, number>,
    preferredRoute: saved.preferredRoute,
    equippedAscensionLoadout: saved.equippedAscensionLoadout as string[],
    unlockedAscensionPerks: saved.unlockedAscensionPerks as Record<string, boolean>,
    activeRun: saved.activeRun as Record<string, unknown> | null,
  });
}

export { DEFAULT_HULEBU_PROGRESS };
