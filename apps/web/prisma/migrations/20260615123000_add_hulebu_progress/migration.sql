CREATE TABLE IF NOT EXISTS "HulebuProgress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "bankedCoins" INTEGER NOT NULL DEFAULT 0,
  "bestEndlessLayer" INTEGER NOT NULL DEFAULT 0,
  "bestAscensionLevel" INTEGER NOT NULL DEFAULT 1,
  "dailyBestLevels" JSONB NOT NULL,
  "achievements" JSONB NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HulebuProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "HulebuProgress_userId_key" ON "HulebuProgress"("userId");
CREATE INDEX IF NOT EXISTS "HulebuProgress_updatedAt_idx" ON "HulebuProgress"("updatedAt");

ALTER TABLE "HulebuProgress"
ADD CONSTRAINT "HulebuProgress_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
