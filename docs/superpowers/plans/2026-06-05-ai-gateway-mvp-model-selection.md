# AI Gateway MVP Model Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first AI Gateway MVP so each AI capability page can show only compatible models, charge model-specific credits, and route requests through a unified gateway instead of tool-specific model calls.

**Architecture:** The MVP introduces a platform AI layer with capability definitions, model catalog, cost policy, credential source resolution, request logging, and provider adapters. Frontend pages request a capability-specific model list before the user submits a task; the gateway still validates capability, model, permission, credential source, and credit cost on the server.

**Tech Stack:** Next.js App Router, TypeScript, Prisma/PostgreSQL, Vitest, Auth.js session helpers, existing `CreditWallet` / `CreditLedger` account concepts, OpenAI-compatible HTTP adapter, mock provider for deterministic tests.

---

## 1. Scope

This plan covers the first implementation slice after T143 is approved. It should not be implemented inside T143 itself.

In scope:

- AI capability constants.
- Model catalog and capability-model availability.
- Static model cost policy.
- Capability-specific model list API.
- Gateway task API.
- Request log schema and service.
- Credit check hook using existing account wallet concepts.
- Mock provider for tests.
- OpenAI-compatible adapter interface and configuration shape.
- TimePick automatic recognition integration plan as the first product trial.

Out of scope:

- Persisting user provider keys.
- Key Vault.
- Provider key pool rotation.
- Automatic model routing.
- Real payment, subscription, or recharge.
- Cross-tool workflow automation.
- Migrating the separate existing model-config project before Lee uploads it.

## 2. Planned Files

Create:

- `apps/web/src/lib/ai/capabilities.ts`  
  Defines supported AI capabilities and helpers for validating capability ids.

- `apps/web/src/lib/ai/model-catalog.ts`  
  Defines the first model catalog, capability-model mapping, display metadata, and cost values.

- `apps/web/src/lib/ai/credential-source.ts`  
  Defines `platform_pool`, `user_ephemeral_key`, and future `user_configured_model` handling.

- `apps/web/src/lib/ai/ai-gateway.ts`  
  Main orchestration service for task validation, cost checks, provider execution, and logging.

- `apps/web/src/lib/ai/provider-adapter.ts`  
  Shared provider adapter interface.

- `apps/web/src/lib/ai/providers/mock-provider.ts`  
  Deterministic provider used by tests and local dry runs.

- `apps/web/src/lib/ai/providers/openai-compatible-provider.ts`  
  Adapter shell for OpenAI-compatible providers.

- `apps/web/src/lib/ai/ai-request-log.ts`  
  Creates sanitized request log records.

- `apps/web/src/lib/ai/__tests__/model-catalog.test.ts`  
  Tests capability filtering and model cost metadata.

- `apps/web/src/lib/ai/__tests__/ai-gateway.test.ts`  
  Tests gateway validation, credit checks, provider calls, and sanitized logging.

- `apps/web/src/app/api/ai/capabilities/[capability]/models/route.ts`  
  Returns only models available for the requested capability.

- `apps/web/src/app/api/ai/tasks/route.ts`  
  Accepts AI task requests and calls the gateway.

Modify:

- `apps/web/prisma/schema.prisma`  
  Adds AI request log model and any model catalog tables only if the implementation chooses database-backed catalog. The first implementation may keep catalog as code constants and only persist request logs.

- `apps/web/src/lib/account/**`  
  Only if credit check needs a shared helper around `CreditWallet` and `CreditLedger`.

- `docs/tasks/**`, `docs/progress/**`, `docs/completion/**`  
  Task records for whichever implementation task is created after T143.

## 3. Data Model

Recommended first database model:

```prisma
model AiGatewayRequestLog {
  id               String   @id @default(cuid())
  userId           String?
  productSlug      String
  toolSlug         String?
  capability       String
  modelId          String
  credentialSource String
  status           String
  creditCost       Int
  providerId       String?
  inputSummary     String?
  outputSummary    String?
  errorCode        String?
  metadata         Json?
  createdAt        DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId, createdAt])
  @@index([productSlug, capability, createdAt])
  @@index([status, createdAt])
}
```

The first catalog can be TypeScript constants, because model availability and prices will change often during planning.

## 4. API Contracts

### 4.1 Capability model list

Route:

```text
GET /api/ai/capabilities/[capability]/models
```

Response:

```json
{
  "capability": "structured_extraction",
  "models": [
    {
      "modelId": "mock-structured-fast",
      "displayName": "快速结构化识别",
      "providerId": "mock",
      "creditCost": 1,
      "speedTier": "fast",
      "qualityTier": "standard",
      "recommended": true,
      "credentialSources": ["platform_pool", "user_ephemeral_key"]
    }
  ]
}
```

### 4.2 AI task

Route:

```text
POST /api/ai/tasks
```

Request:

```json
{
  "capability": "structured_extraction",
  "productSlug": "timepick",
  "toolSlug": "timepick",
  "modelId": "mock-structured-fast",
  "credentialSource": "platform_pool",
  "input": {
    "text": "https://example.com ..."
  }
}
```

Response:

```json
{
  "taskId": "req_123",
  "status": "succeeded",
  "creditCost": 1,
  "result": {
    "title": "Example",
    "summary": "Structured extraction result"
  }
}
```

## 5. Task Breakdown

### Task 1: Capability and Model Catalog

**Files:**

- Create: `apps/web/src/lib/ai/capabilities.ts`
- Create: `apps/web/src/lib/ai/model-catalog.ts`
- Create: `apps/web/src/lib/ai/__tests__/model-catalog.test.ts`

- [ ] **Step 1: Write catalog tests**

```ts
import { describe, expect, it } from "vitest";
import { getModelsForCapability, getModelForCapability } from "../model-catalog";

describe("AI model catalog", () => {
  it("returns only models enabled for the requested capability", () => {
    const models = getModelsForCapability("structured_extraction");

    expect(models.length).toBeGreaterThan(0);
    expect(models.every((model) => model.capabilities.includes("structured_extraction"))).toBe(true);
  });

  it("does not return image edit models for structured extraction", () => {
    const models = getModelsForCapability("structured_extraction");

    expect(models.some((model) => model.modelId === "mock-image-edit")).toBe(false);
  });

  it("finds a model only when it supports the capability", () => {
    expect(getModelForCapability("structured_extraction", "mock-structured-fast")?.creditCost).toBe(1);
    expect(getModelForCapability("structured_extraction", "mock-image-edit")).toBeNull();
  });
});
```

- [ ] **Step 2: Run failing test**

Run:

```bash
npm run test -w apps/web -- model-catalog
```

Expected: fails because `model-catalog.ts` does not exist.

- [ ] **Step 3: Implement capability and catalog constants**

Create `apps/web/src/lib/ai/capabilities.ts`:

```ts
export const aiCapabilities = [
  "text_generation",
  "structured_extraction",
  "image_understanding",
  "image_generation",
  "image_edit",
  "ocr",
  "moderation",
] as const;

export type AiCapability = (typeof aiCapabilities)[number];

export function isAiCapability(value: string): value is AiCapability {
  return aiCapabilities.includes(value as AiCapability);
}
```

Create `apps/web/src/lib/ai/model-catalog.ts`:

```ts
import type { AiCapability } from "./capabilities";

export type CredentialSource = "platform_pool" | "user_ephemeral_key" | "user_configured_model";

export type AiModelCatalogItem = {
  modelId: string;
  displayName: string;
  providerId: string;
  capabilities: AiCapability[];
  creditCost: number;
  speedTier: "fast" | "balanced" | "slow";
  qualityTier: "standard" | "balanced" | "high";
  recommended: boolean;
  credentialSources: CredentialSource[];
  enabled: boolean;
};

export const aiModelCatalog: AiModelCatalogItem[] = [
  {
    modelId: "mock-structured-fast",
    displayName: "快速结构化识别",
    providerId: "mock",
    capabilities: ["structured_extraction"],
    creditCost: 1,
    speedTier: "fast",
    qualityTier: "standard",
    recommended: true,
    credentialSources: ["platform_pool", "user_ephemeral_key"],
    enabled: true,
  },
  {
    modelId: "mock-image-edit",
    displayName: "测试图片编辑",
    providerId: "mock",
    capabilities: ["image_edit"],
    creditCost: 10,
    speedTier: "balanced",
    qualityTier: "balanced",
    recommended: true,
    credentialSources: ["platform_pool"],
    enabled: true,
  },
];

export function getModelsForCapability(capability: AiCapability): AiModelCatalogItem[] {
  return aiModelCatalog.filter((model) => model.enabled && model.capabilities.includes(capability));
}

export function getModelForCapability(
  capability: AiCapability,
  modelId: string,
): AiModelCatalogItem | null {
  return getModelsForCapability(capability).find((model) => model.modelId === modelId) ?? null;
}
```

- [ ] **Step 4: Run passing test**

Run:

```bash
npm run test -w apps/web -- model-catalog
```

Expected: 3 tests pass.

### Task 2: Capability Model List API

**Files:**

- Create: `apps/web/src/app/api/ai/capabilities/[capability]/models/route.ts`
- Test: add route-focused tests if the existing app has API route test helpers; otherwise test the route's exported pure helper from `model-catalog.ts`.

- [ ] **Step 1: Implement route**

```ts
import { NextResponse } from "next/server";
import { isAiCapability } from "@/lib/ai/capabilities";
import { getModelsForCapability } from "@/lib/ai/model-catalog";

export async function GET(
  _request: Request,
  context: { params: Promise<{ capability: string }> },
) {
  const { capability } = await context.params;

  if (!isAiCapability(capability)) {
    return NextResponse.json({ error: "Unknown AI capability." }, { status: 404 });
  }

  const models = getModelsForCapability(capability).map((model) => ({
    modelId: model.modelId,
    displayName: model.displayName,
    providerId: model.providerId,
    creditCost: model.creditCost,
    speedTier: model.speedTier,
    qualityTier: model.qualityTier,
    recommended: model.recommended,
    credentialSources: model.credentialSources,
  }));

  return NextResponse.json({ capability, models });
}
```

- [ ] **Step 2: Verify route typecheck**

Run:

```bash
npm run typecheck -w apps/web
```

Expected: typecheck passes.

### Task 3: Provider Adapter Interface and Mock Provider

**Files:**

- Create: `apps/web/src/lib/ai/provider-adapter.ts`
- Create: `apps/web/src/lib/ai/providers/mock-provider.ts`

- [ ] **Step 1: Define adapter interface**

```ts
import type { AiCapability } from "./capabilities";

export type AiProviderRequest = {
  capability: AiCapability;
  modelId: string;
  input: unknown;
};

export type AiProviderResponse = {
  output: unknown;
  outputSummary: string;
};

export type AiProviderAdapter = {
  providerId: string;
  execute(request: AiProviderRequest): Promise<AiProviderResponse>;
};
```

- [ ] **Step 2: Add mock provider**

```ts
import type { AiProviderAdapter } from "../provider-adapter";

export const mockAiProvider: AiProviderAdapter = {
  providerId: "mock",
  async execute(request) {
    return {
      output: {
        capability: request.capability,
        modelId: request.modelId,
        extractedTitle: "Mock result",
      },
      outputSummary: `Mock ${request.capability} result`,
    };
  },
};
```

### Task 4: AI Gateway Validation and Execution

**Files:**

- Create: `apps/web/src/lib/ai/credential-source.ts`
- Create: `apps/web/src/lib/ai/ai-gateway.ts`
- Create: `apps/web/src/lib/ai/__tests__/ai-gateway.test.ts`

- [ ] **Step 1: Write gateway validation tests**

```ts
import { describe, expect, it } from "vitest";
import { runAiGatewayTask } from "../ai-gateway";
import { mockAiProvider } from "../providers/mock-provider";

describe("AI Gateway", () => {
  it("rejects a model that does not support the requested capability", async () => {
    await expect(
      runAiGatewayTask(
        {
          capability: "structured_extraction",
          productSlug: "timepick",
          modelId: "mock-image-edit",
          credentialSource: "platform_pool",
          input: { text: "hello" },
        },
        { providers: [mockAiProvider] },
      ),
    ).rejects.toThrow("Model is not available for this capability.");
  });

  it("runs a valid mock provider request and returns credit cost", async () => {
    const result = await runAiGatewayTask(
      {
        capability: "structured_extraction",
        productSlug: "timepick",
        modelId: "mock-structured-fast",
        credentialSource: "platform_pool",
        input: { text: "hello" },
      },
      { providers: [mockAiProvider] },
    );

    expect(result.creditCost).toBe(1);
    expect(result.status).toBe("succeeded");
  });
});
```

- [ ] **Step 2: Implement minimal gateway**

```ts
import type { AiCapability } from "./capabilities";
import { getModelForCapability } from "./model-catalog";
import type { CredentialSource } from "./model-catalog";
import type { AiProviderAdapter } from "./provider-adapter";

export type AiGatewayTaskInput = {
  capability: AiCapability;
  productSlug: string;
  toolSlug?: string;
  modelId: string;
  credentialSource: CredentialSource;
  input: unknown;
};

export type AiGatewayDependencies = {
  providers: AiProviderAdapter[];
};

export async function runAiGatewayTask(
  task: AiGatewayTaskInput,
  dependencies: AiGatewayDependencies,
) {
  const model = getModelForCapability(task.capability, task.modelId);
  if (!model) {
    throw new Error("Model is not available for this capability.");
  }

  if (!model.credentialSources.includes(task.credentialSource)) {
    throw new Error("Credential source is not available for this model.");
  }

  const provider = dependencies.providers.find((item) => item.providerId === model.providerId);
  if (!provider) {
    throw new Error("Provider is not available.");
  }

  const response = await provider.execute({
    capability: task.capability,
    modelId: task.modelId,
    input: task.input,
  });

  return {
    status: "succeeded" as const,
    creditCost: model.creditCost,
    output: response.output,
    outputSummary: response.outputSummary,
  };
}
```

- [ ] **Step 3: Run gateway tests**

Run:

```bash
npm run test -w apps/web -- ai-gateway
```

Expected: 2 tests pass.

### Task 5: Request Log Schema and Sanitized Logging

**Files:**

- Modify: `apps/web/prisma/schema.prisma`
- Create: `apps/web/src/lib/ai/ai-request-log.ts`
- Test: `apps/web/src/lib/ai/__tests__/ai-request-log.test.ts`

- [ ] **Step 1: Add Prisma model**

Add the `AiGatewayRequestLog` model shown in this plan's Data Model section.

- [ ] **Step 2: Generate Prisma client**

Run:

```bash
npm exec prisma generate -w apps/web
```

Expected: Prisma client generation succeeds.

- [ ] **Step 3: Add sanitized summary helper**

```ts
export function summarizeAiInput(input: unknown): string {
  const value = typeof input === "string" ? input : JSON.stringify(input);
  return value.length > 160 ? `${value.slice(0, 157)}...` : value;
}
```

- [ ] **Step 4: Add test for truncation**

```ts
import { describe, expect, it } from "vitest";
import { summarizeAiInput } from "../ai-request-log";

describe("AI request log sanitization", () => {
  it("truncates long input summaries", () => {
    expect(summarizeAiInput("x".repeat(200))).toHaveLength(160);
  });
});
```

### Task 6: AI Task API

**Files:**

- Create: `apps/web/src/app/api/ai/tasks/route.ts`

- [ ] **Step 1: Implement route with server validation**

```ts
import { NextResponse } from "next/server";
import { isAiCapability } from "@/lib/ai/capabilities";
import { runAiGatewayTask } from "@/lib/ai/ai-gateway";
import { mockAiProvider } from "@/lib/ai/providers/mock-provider";

export async function POST(request: Request) {
  const body = await request.json();

  if (!isAiCapability(body.capability)) {
    return NextResponse.json({ error: "Unknown AI capability." }, { status: 400 });
  }

  try {
    const result = await runAiGatewayTask(
      {
        capability: body.capability,
        productSlug: String(body.productSlug || "web"),
        toolSlug: body.toolSlug ? String(body.toolSlug) : undefined,
        modelId: String(body.modelId),
        credentialSource: body.credentialSource || "platform_pool",
        input: body.input ?? {},
      },
      { providers: [mockAiProvider] },
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI task failed." },
      { status: 400 },
    );
  }
}
```

- [ ] **Step 2: Run typecheck**

Run:

```bash
npm run typecheck -w apps/web
```

Expected: typecheck passes.

### Task 7: OpenAI-Compatible Adapter Shell

**Files:**

- Create: `apps/web/src/lib/ai/providers/openai-compatible-provider.ts`

- [ ] **Step 1: Add adapter shell**

```ts
import type { AiProviderAdapter } from "../provider-adapter";

export type OpenAiCompatibleProviderConfig = {
  providerId: string;
  baseUrl: string;
  apiKey: string;
};

export function createOpenAiCompatibleProvider(
  config: OpenAiCompatibleProviderConfig,
): AiProviderAdapter {
  return {
    providerId: config.providerId,
    async execute() {
      throw new Error("OpenAI-compatible provider is configured but not enabled for MVP dry run.");
    },
  };
}
```

- [ ] **Step 2: Keep real calls disabled until a provider is approved**

Run:

```bash
npm run typecheck -w apps/web
```

Expected: typecheck passes and no network call is possible through this shell.

### Task 8: TimePick Automatic Recognition Trial Planning

**Files:**

- Modify only after separate task approval: `apps/web/src/app/api/timepick/**`
- Modify only after separate task approval: `/Users/lee/Desktop/Lee/TimePick/src/**`

- [ ] **Step 1: Define trial request shape**

Use this shape for the later TimePick integration:

```json
{
  "capability": "structured_extraction",
  "productSlug": "timepick",
  "toolSlug": "timepick",
  "modelId": "mock-structured-fast",
  "credentialSource": "platform_pool",
  "input": {
    "url": "https://example.com",
    "titleHint": "Optional title",
    "contentHint": "Optional extracted text"
  }
}
```

- [ ] **Step 2: Define expected result shape**

```json
{
  "title": "Resource title",
  "summary": "Short summary",
  "tags": ["ai", "learning"],
  "resourceType": "article"
}
```

- [ ] **Step 3: Create a separate implementation task**

Create a new task after T143 approval that connects TimePick automatic recognition to `POST /api/ai/tasks`.

## 6. Verification Commands

Run these after implementation tasks, not during T143 documentation planning:

```bash
npm run test -w apps/web -- model-catalog ai-gateway ai-request-log
npm run typecheck -w apps/web
npm run lint -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

## 7. Handoff Notes

- The frontend model picker must fetch models by capability before showing options.
- The gateway must still validate the submitted model on the server.
- Credit cost is static in the first MVP and can later become token-aware.
- `user_ephemeral_key` can be supported without storing the key.
- `user_configured_model` should wait until Lee uploads the other project for review.
- Mock provider is required for deterministic tests even if OpenAI-compatible is the first real adapter.

