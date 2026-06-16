import { db } from "@/lib/db";

export type HulebuProgressRecord = {
  bankedCoins: number;
  bestEndlessLayer: number;
  bestAscensionLevel: number;
  dailyBestLevels: Record<string, number>;
  achievements: Record<string, string>;
};

type StoredHulebuProgress = {
  achievements: unknown;
  bankedCoins: number;
  bestAscensionLevel: number;
  bestEndlessLayer: number;
  dailyBestLevels: unknown;
  userId: string;
};

const hulebuProgressTable = (db as typeof db & {
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
  achievements: {},
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

function sanitizeProgress(input?: Partial<HulebuProgressRecord> | null): HulebuProgressRecord {
  return {
    bankedCoins: Number.isFinite(input?.bankedCoins) ? Math.max(0, Number(input?.bankedCoins)) : 0,
    bestEndlessLayer: Number.isFinite(input?.bestEndlessLayer) ? Math.max(0, Number(input?.bestEndlessLayer)) : 0,
    bestAscensionLevel:
      Number.isFinite(input?.bestAscensionLevel) && Number(input?.bestAscensionLevel) >= 2 ? 2 : 1,
    dailyBestLevels: sanitizeDailyBestLevels(input?.dailyBestLevels),
    achievements: sanitizeAchievements(input?.achievements),
  };
}

export function mergeHulebuProgress(
  accountProgress?: Partial<HulebuProgressRecord> | null,
  localProgress?: Partial<HulebuProgressRecord> | null,
): HulebuProgressRecord {
  const account = sanitizeProgress(accountProgress);
  const local = sanitizeProgress(localProgress);

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
      userId: user.id,
    },
    update: {
      achievements: merged.achievements,
      bankedCoins: merged.bankedCoins,
      bestAscensionLevel: merged.bestAscensionLevel,
      bestEndlessLayer: merged.bestEndlessLayer,
      dailyBestLevels: merged.dailyBestLevels,
    },
    where: { userId: user.id },
  });

  return sanitizeProgress({
    achievements: saved.achievements as Record<string, string>,
    bankedCoins: saved.bankedCoins,
    bestAscensionLevel: saved.bestAscensionLevel,
    bestEndlessLayer: saved.bestEndlessLayer,
    dailyBestLevels: saved.dailyBestLevels as Record<string, number>,
  });
}

export { DEFAULT_HULEBU_PROGRESS };
