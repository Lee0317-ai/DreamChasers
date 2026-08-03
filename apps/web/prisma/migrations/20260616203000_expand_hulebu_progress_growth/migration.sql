ALTER TABLE "HulebuProgress"
ADD COLUMN "dailyStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastDailySeed" TEXT,
ADD COLUMN "upgrades" JSONB NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN "routeProgress" JSONB NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN "preferredRoute" TEXT,
ADD COLUMN "equippedAscensionLoadout" JSONB NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN "unlockedAscensionPerks" JSONB NOT NULL DEFAULT '{}'::jsonb;
