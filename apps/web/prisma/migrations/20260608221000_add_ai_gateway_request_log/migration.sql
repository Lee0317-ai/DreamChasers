CREATE TABLE IF NOT EXISTS "AiGatewayRequestLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "productSlug" TEXT NOT NULL,
  "toolSlug" TEXT,
  "capability" TEXT NOT NULL,
  "modelId" TEXT NOT NULL,
  "credentialSource" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "creditCost" INTEGER NOT NULL,
  "providerId" TEXT NOT NULL,
  "inputSummary" TEXT,
  "outputSummary" TEXT,
  "errorCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiGatewayRequestLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AiGatewayRequestLog_userId_createdAt_idx"
ON "AiGatewayRequestLog"("userId", "createdAt");

CREATE INDEX IF NOT EXISTS "AiGatewayRequestLog_productSlug_capability_createdAt_idx"
ON "AiGatewayRequestLog"("productSlug", "capability", "createdAt");

CREATE INDEX IF NOT EXISTS "AiGatewayRequestLog_status_createdAt_idx"
ON "AiGatewayRequestLog"("status", "createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'AiGatewayRequestLog_userId_fkey'
  ) THEN
    ALTER TABLE "AiGatewayRequestLog"
    ADD CONSTRAINT "AiGatewayRequestLog_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
