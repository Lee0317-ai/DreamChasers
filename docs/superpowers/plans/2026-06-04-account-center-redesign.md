# Account Center Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the DreamChasers account center UI around the Open Design account system while keeping phase one grounded in email registration verification, email-password login, and existing account data.

**Architecture:** Add focused account view-model helpers for navigation, security state, and AI model-source copy, then render those helpers through shared account shell components. Route files remain thin entry points; reusable account UI lives under `apps/web/src/components/account/`, pure account rules live under `apps/web/src/lib/account/`, and account CSS lives in a named section of `apps/web/src/app/globals.css`.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Auth.js, Prisma, Vitest, global CSS, `lucide-react` icons.

---

## Scope

This plan implements phase one only:

- Email registration verification and email-password login with the new visual treatment.
- Account shell and navigation.
- Account overview, profile, security, devices, AI credits, recharge, subscription, LLM config, API keys, and product access pages.
- LLM config as a visible phase-two control surface that explains AI Gateway model sources without saving provider keys.

This plan does not implement real payment, subscription mutation, provider calls, external Gateway BYOK persistence, encrypted Key Vault, local connector, password login, SMS login, OAuth, MFA, real-name verification, or device forced logout.

## File Structure

- Modify `apps/web/package.json` and `package-lock.json`: add `lucide-react`.
- Create `apps/web/src/lib/account/account-navigation.ts`: sidebar and mobile navigation model.
- Create `apps/web/src/lib/account/account-view-model.ts`: greeting, avatar initial, security summary, device/audit display helpers.
- Create `apps/web/src/lib/account/account-ai-config.ts`: AI model-source display model based on T108.
- Create `apps/web/src/lib/account/__tests__/account-navigation.test.ts`: navigation route coverage.
- Create `apps/web/src/lib/account/__tests__/account-view-model.test.ts`: dashboard/security/device display rules.
- Create `apps/web/src/lib/account/__tests__/account-ai-config.test.ts`: model-source ordering and safety copy.
- Create `apps/web/src/components/account/AccountShell.tsx`: shared account layout with sidebar and mobile nav.
- Create `apps/web/src/components/account/AccountUi.tsx`: small reusable account UI primitives.
- Modify `apps/web/src/app/globals.css`: replace the current compact account styles with Open Design-derived account layout styles.
- Modify `apps/web/src/app/login/page.tsx`: redesign the email-only login page.
- Modify `apps/web/src/app/account/page.tsx`: account overview.
- Create `apps/web/src/app/account/profile/page.tsx`: profile page.
- Modify `apps/web/src/app/account/security/page.tsx`: security page.
- Create `apps/web/src/app/account/devices/page.tsx`: devices page.
- Create `apps/web/src/app/account/ai/credits/page.tsx`: AI credits page.
- Create `apps/web/src/app/account/ai/recharge/page.tsx`: recharge page with disabled payment action.
- Create `apps/web/src/app/account/ai/subscription/page.tsx`: subscription page with disabled plan mutation.
- Create `apps/web/src/app/account/ai/llm-config/page.tsx`: LLM config page using T108 source model.
- Modify `apps/web/src/app/account/ai/page.tsx`: redirect to `/account/ai/llm-config` or render a short gateway overview with links.
- Modify `apps/web/src/app/account/billing/page.tsx`: redirect to `/account/ai/credits`.
- Modify `apps/web/src/app/account/api-keys/page.tsx`: wrap in account shell.
- Create `apps/web/src/app/account/products/page.tsx`: product token access page.
- Modify `apps/web/src/components/account/ProductSessionManager.tsx`: fit new page layout.
- Modify `apps/web/src/components/account/ApiKeyManager.tsx`: fit new page layout.
- Update docs after implementation: task item, claim, progress, and completion record for the implementation task.

## Task 1: Add Account Navigation Model

**Files:**
- Create: `apps/web/src/lib/account/account-navigation.ts`
- Create: `apps/web/src/lib/account/__tests__/account-navigation.test.ts`

- [ ] **Step 1: Write the failing navigation tests**

Create `apps/web/src/lib/account/__tests__/account-navigation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { accountNavGroups, findActiveAccountNavItem } from "../account-navigation";

describe("account-navigation", () => {
  it("keeps account, AI, and developer navigation in stable groups", () => {
    expect(accountNavGroups.map((group) => group.label)).toEqual(["账号", "AI 能力", "开发者和产品"]);
    expect(accountNavGroups.flatMap((group) => group.items.map((item) => item.href))).toEqual([
      "/account",
      "/account/profile",
      "/account/security",
      "/account/devices",
      "/account/ai/credits",
      "/account/ai/recharge",
      "/account/ai/subscription",
      "/account/ai/llm-config",
      "/account/api-keys",
      "/account/products"
    ]);
  });

  it("marks nested account routes through the nearest parent item", () => {
    expect(findActiveAccountNavItem("/account/security")?.href).toBe("/account/security");
    expect(findActiveAccountNavItem("/account/security/events")?.href).toBe("/account/security");
    expect(findActiveAccountNavItem("/account/ai/credits/history")?.href).toBe("/account/ai/credits");
    expect(findActiveAccountNavItem("/tools")?.href).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
npm run test -w apps/web -- account-navigation
```

Expected: FAIL because `account-navigation.ts` does not exist.

- [ ] **Step 3: Implement the navigation model**

Create `apps/web/src/lib/account/account-navigation.ts`:

```ts
export type AccountNavItem = {
  href: string;
  label: string;
  icon: "layout-dashboard" | "user" | "shield" | "monitor" | "coins" | "credit-card" | "badge" | "bot" | "key" | "boxes";
};

export type AccountNavGroup = {
  label: string;
  items: AccountNavItem[];
};

export const accountNavGroups: AccountNavGroup[] = [
  {
    label: "账号",
    items: [
      { href: "/account", icon: "layout-dashboard", label: "账号概览" },
      { href: "/account/profile", icon: "user", label: "个人信息" },
      { href: "/account/security", icon: "shield", label: "账号安全" },
      { href: "/account/devices", icon: "monitor", label: "登录设备" }
    ]
  },
  {
    label: "AI 能力",
    items: [
      { href: "/account/ai/credits", icon: "coins", label: "积分管理" },
      { href: "/account/ai/recharge", icon: "credit-card", label: "充值中心" },
      { href: "/account/ai/subscription", icon: "badge", label: "订阅管理" },
      { href: "/account/ai/llm-config", icon: "bot", label: "LLM 配置" }
    ]
  },
  {
    label: "开发者和产品",
    items: [
      { href: "/account/api-keys", icon: "key", label: "API Key" },
      { href: "/account/products", icon: "boxes", label: "产品接入" }
    ]
  }
];

export function findActiveAccountNavItem(pathname: string) {
  const allItems = accountNavGroups.flatMap((group) => group.items);
  return allItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run:

```bash
npm run test -w apps/web -- account-navigation
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/account/account-navigation.ts apps/web/src/lib/account/__tests__/account-navigation.test.ts
git commit -m "feat: add account navigation model"
```

## Task 2: Add Account View Models

**Files:**
- Create: `apps/web/src/lib/account/account-view-model.ts`
- Create: `apps/web/src/lib/account/account-ai-config.ts`
- Create: `apps/web/src/lib/account/__tests__/account-view-model.test.ts`
- Create: `apps/web/src/lib/account/__tests__/account-ai-config.test.ts`

- [ ] **Step 1: Write failing tests for account display rules**

Create `apps/web/src/lib/account/__tests__/account-view-model.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildAccountInitial, buildSecuritySummary, formatAccountDate, toDeviceRows } from "../account-view-model";

describe("account-view-model", () => {
  it("builds a stable avatar initial from display name or email", () => {
    expect(buildAccountInitial("李明远", "lee@example.com")).toBe("李");
    expect(buildAccountInitial("", "lee@example.com")).toBe("L");
    expect(buildAccountInitial("", "")).toBe("U");
  });

  it("summarizes phase-one security without claiming password or phone support", () => {
    expect(buildSecuritySummary({ auditLogCount: 3, emailVerified: true })).toEqual({
      description: "邮箱验证已启用，最近有 3 条安全记录。",
      level: "基础",
      score: 2
    });
    expect(buildSecuritySummary({ auditLogCount: 0, emailVerified: false })).toEqual({
      description: "邮箱仍在等待验证，请重新登录确认邮箱。",
      level: "待确认",
      score: 0
    });
  });

  it("formats account dates for zh-CN screens", () => {
    expect(formatAccountDate(new Date("2026-06-04T10:20:00.000Z"), "Asia/Shanghai")).toContain("2026");
  });

  it("turns audit logs into device-like rows for phase one", () => {
    const rows = toDeviceRows([
      { action: "session_created", createdAt: new Date("2026-06-04T10:00:00.000Z"), id: "a1" },
      { action: "api_key_created", createdAt: new Date("2026-06-04T11:00:00.000Z"), id: "a2" }
    ]);

    expect(rows).toEqual([
      {
        id: "a1",
        location: "位置未记录",
        name: "网页登录",
        status: "当前或近期会话",
        time: new Date("2026-06-04T10:00:00.000Z")
      },
      {
        id: "a2",
        location: "位置未记录",
        name: "账号安全事件",
        status: "已记录",
        time: new Date("2026-06-04T11:00:00.000Z")
      }
    ]);
  });
});
```

- [ ] **Step 2: Write failing tests for AI config copy**

Create `apps/web/src/lib/account/__tests__/account-ai-config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { aiCredentialSources, getPhaseTwoCredentialSources } from "../account-ai-config";

describe("account-ai-config", () => {
  it("keeps T108 credential sources in the expected order", () => {
    expect(aiCredentialSources.map((source) => source.id)).toEqual([
      "platform_pool",
      "user_ephemeral_key",
      "external_gateway_byok",
      "user_encrypted_vault",
      "local_connector"
    ]);
  });

  it("limits phase two to sources that avoid stored provider keys", () => {
    expect(getPhaseTwoCredentialSources().map((source) => source.id)).toEqual([
      "platform_pool",
      "user_ephemeral_key",
      "external_gateway_byok"
    ]);
    expect(getPhaseTwoCredentialSources().every((source) => source.storesProviderKey === false)).toBe(true);
  });
});
```

- [ ] **Step 3: Run tests and verify they fail**

Run:

```bash
npm run test -w apps/web -- account-view-model account-ai-config
```

Expected: FAIL because the new helper files do not exist.

- [ ] **Step 4: Implement account display helpers**

Create `apps/web/src/lib/account/account-view-model.ts`:

```ts
type AuditLogLike = {
  action: string;
  createdAt: Date;
  id: string;
};

export function buildAccountInitial(name: string | null | undefined, email: string | null | undefined) {
  const source = (name || email || "U").trim();
  return source.charAt(0).toLocaleUpperCase("zh-CN") || "U";
}

export function buildSecuritySummary(input: { auditLogCount: number; emailVerified: boolean }) {
  if (!input.emailVerified) {
    return {
      description: "邮箱仍在等待验证，请重新登录确认邮箱。",
      level: "待确认",
      score: 0
    };
  }

  return {
    description: `邮箱验证已启用，最近有 ${input.auditLogCount} 条安全记录。`,
    level: "基础",
    score: input.auditLogCount > 0 ? 2 : 1
  };
}

export function formatAccountDate(value: Date, timeZone = "Asia/Shanghai") {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone
  }).format(value);
}

export function toDeviceRows(logs: AuditLogLike[]) {
  return logs.map((log) => ({
    id: log.id,
    location: "位置未记录",
    name: log.action === "session_created" ? "网页登录" : "账号安全事件",
    status: log.action === "session_created" ? "当前或近期会话" : "已记录",
    time: log.createdAt
  }));
}
```

- [ ] **Step 5: Implement AI config model**

Create `apps/web/src/lib/account/account-ai-config.ts`:

```ts
export type AiCredentialSourceId =
  | "platform_pool"
  | "user_ephemeral_key"
  | "external_gateway_byok"
  | "user_encrypted_vault"
  | "local_connector";

export type AiCredentialSourceView = {
  description: string;
  id: AiCredentialSourceId;
  label: string;
  phase: 2 | 3;
  status: "available-in-phase-two" | "future-mode";
  storesProviderKey: boolean;
};

export const aiCredentialSources: AiCredentialSourceView[] = [
  {
    description: "用户使用平台额度调用 AI 能力，真实 provider 和 key 池由 AI Gateway 管理。",
    id: "platform_pool",
    label: "平台额度",
    phase: 2,
    status: "available-in-phase-two",
    storesProviderKey: false
  },
  {
    description: "用户在单次请求中输入 Key，请求结束后丢弃，不入库、不写日志。",
    id: "user_ephemeral_key",
    label: "临时 Key",
    phase: 2,
    status: "available-in-phase-two",
    storesProviderKey: false
  },
  {
    description: "用户在外部 Gateway 托管 provider key，平台只保存 route 或 credential reference。",
    id: "external_gateway_byok",
    label: "外部 Gateway BYOK",
    phase: 2,
    status: "available-in-phase-two",
    storesProviderKey: false
  },
  {
    description: "平台加密保存用户 provider key，需要 KMS、轮换、删除和审计能力。",
    id: "user_encrypted_vault",
    label: "加密 Key Vault",
    phase: 3,
    status: "future-mode",
    storesProviderKey: true
  },
  {
    description: "用户运行本地连接器，由本地服务读取环境变量并代理模型请求。",
    id: "local_connector",
    label: "本地连接器",
    phase: 3,
    status: "future-mode",
    storesProviderKey: false
  }
];

export function getPhaseTwoCredentialSources() {
  return aiCredentialSources.filter((source) => source.phase === 2);
}
```

- [ ] **Step 6: Run tests and verify they pass**

Run:

```bash
npm run test -w apps/web -- account-view-model account-ai-config
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/lib/account/account-view-model.ts apps/web/src/lib/account/account-ai-config.ts apps/web/src/lib/account/__tests__/account-view-model.test.ts apps/web/src/lib/account/__tests__/account-ai-config.test.ts
git commit -m "feat: add account center view models"
```

## Task 3: Add Account Shell Components and Styles

**Files:**
- Modify: `apps/web/package.json`
- Modify: `package-lock.json`
- Create: `apps/web/src/components/account/AccountShell.tsx`
- Create: `apps/web/src/components/account/AccountUi.tsx`
- Modify: `apps/web/src/app/globals.css`

- [ ] **Step 1: Install lucide icons**

Run:

```bash
npm install lucide-react -w apps/web
```

Expected: `apps/web/package.json` contains `lucide-react`, and `package-lock.json` updates.

- [ ] **Step 2: Create reusable UI primitives**

Create `apps/web/src/components/account/AccountUi.tsx`:

```tsx
import type { ReactNode } from "react";

export function AccountSection({
  actions,
  children,
  eyebrow,
  title
}: {
  actions?: ReactNode;
  children: ReactNode;
  eyebrow?: string;
  title: string;
}) {
  return (
    <section className="account-card">
      <div className="account-card-header">
        <div>
          {eyebrow ? <p className="account-kicker">{eyebrow}</p> : null}
          <h2>{title}</h2>
        </div>
        {actions ? <div className="account-card-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function AccountStatusPill({
  tone = "neutral",
  children
}: {
  children: ReactNode;
  tone?: "accent" | "danger" | "neutral" | "success" | "warning";
}) {
  return <span className={`account-pill account-pill-${tone}`}>{children}</span>;
}

export function AccountEmptyState({ children }: { children: ReactNode }) {
  return <p className="account-empty">{children}</p>;
}
```

- [ ] **Step 3: Create account shell**

Create `apps/web/src/components/account/AccountShell.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Badge,
  Bot,
  Boxes,
  Coins,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  Monitor,
  Shield,
  User
} from "lucide-react";
import { accountNavGroups, findActiveAccountNavItem, type AccountNavItem } from "@/lib/account/account-navigation";

const iconMap = {
  badge: Badge,
  bot: Bot,
  boxes: Boxes,
  coins: Coins,
  "credit-card": CreditCard,
  key: KeyRound,
  "layout-dashboard": LayoutDashboard,
  monitor: Monitor,
  shield: Shield,
  user: User
} satisfies Record<AccountNavItem["icon"], React.ComponentType<{ size?: number }>>;

export function AccountShell({
  children,
  email,
  initial,
  name
}: {
  children: React.ReactNode;
  email: string;
  initial: string;
  name: string;
}) {
  const pathname = usePathname();
  const active = findActiveAccountNavItem(pathname || "/account");

  return (
    <div className="account-shell">
      <aside className="account-sidebar" aria-label="账号中心导航">
        <Link className="account-sidebar-logo" href="/account">
          <span className="account-logo-mark">D</span>
          <span>统一中心</span>
        </Link>
        <nav className="account-sidebar-nav">
          {accountNavGroups.map((group) => (
            <div className="account-nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <Link className={active?.href === item.href ? "active" : ""} href={item.href} key={item.href}>
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="account-sidebar-user">
          <span className="account-avatar">{initial}</span>
          <span>
            <strong>{name}</strong>
            <small>{email}</small>
          </span>
        </div>
      </aside>
      <main className="account-main">
        {children}
      </main>
      <nav className="account-mobile-tabs" aria-label="账号中心移动导航">
        {accountNavGroups.slice(0, 2).flatMap((group) => group.items).slice(0, 5).map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <Link className={active?.href === item.href ? "active" : ""} href={item.href} key={item.href}>
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
```

- [ ] **Step 4: Replace account CSS section**

Modify `apps/web/src/app/globals.css` by replacing the existing `.account-auth-page` through the final account media query with the new account CSS below:

```css
.account-auth-page {
  min-height: calc(100vh - 60px);
  display: grid;
  place-items: center;
  padding: clamp(28px, 6vw, 64px) 20px;
  background: radial-gradient(circle at 50% 30%, oklch(46% 0.16 255 / 0.05) 0%, transparent 58%), var(--bg);
}

.account-auth-panel {
  width: min(100%, 440px);
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  padding: clamp(28px, 5vw, 44px);
}

.account-shell {
  min-height: calc(100vh - 60px);
  background: var(--bg);
}

.account-sidebar {
  position: fixed;
  inset: 60px auto 0 0;
  width: 260px;
  border-right: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  padding: 22px 0;
}

.account-sidebar-logo,
.account-sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
}

.account-logo-mark,
.account-avatar {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.account-logo-mark {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: var(--accent);
  color: #fff;
  font-weight: 800;
}

.account-sidebar-logo {
  min-height: 34px;
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0;
}

.account-sidebar-nav {
  flex: 1;
  margin-top: 20px;
  overflow-y: auto;
  padding: 0 12px;
}

.account-nav-group {
  display: grid;
  gap: 2px;
  margin-bottom: 14px;
}

.account-nav-group p {
  padding: 12px 12px 6px;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.account-nav-group a {
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 6px;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0 12px;
}

.account-nav-group a:hover,
.account-nav-group a.active {
  background: var(--surface-2);
  color: var(--fg);
}

.account-sidebar-user {
  border-top: 1px solid var(--border);
  padding-top: 16px;
}

.account-avatar {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--surface-2);
  color: var(--muted);
  font-weight: 800;
}

.account-sidebar-user span:last-child {
  min-width: 0;
  display: grid;
}

.account-sidebar-user strong,
.account-sidebar-user small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-sidebar-user small {
  color: var(--muted);
}

.account-main {
  margin-left: 260px;
  max-width: 1040px;
  padding: 32px;
}

.account-page-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.account-kicker {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.account-page-heading h1,
.account-card h2 {
  font-family: var(--font-display);
  letter-spacing: 0;
}

.account-page-heading h1 {
  font-size: clamp(1.55rem, 3vw, 2.2rem);
  line-height: 1.12;
}

.account-muted,
.account-empty {
  color: var(--muted);
}

.account-card {
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  padding: 24px;
  margin-bottom: 16px;
}

.account-card-header,
.account-card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.account-card-header {
  margin-bottom: 18px;
}

.account-stats-grid,
.account-action-grid,
.account-product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.account-stat,
.account-action,
.account-list-row {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-2);
  padding: 14px;
}

.account-list {
  display: grid;
  gap: 10px;
}

.account-list-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.account-pill {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 800;
  padding: 0 10px;
}

.account-pill-accent {
  background: var(--accent-soft);
  color: var(--accent);
}

.account-pill-success {
  background: oklch(96% 0.015 145);
  color: var(--success);
}

.account-pill-warning {
  background: oklch(96% 0.015 80);
  color: var(--warning);
}

.account-pill-danger {
  background: oklch(96% 0.015 25);
  color: var(--danger);
}

.account-button,
.account-secondary-link,
.account-panel button,
.account-inline-form button,
.account-auth-form button {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
  font-weight: 800;
  padding: 0 16px;
}

.account-button.secondary,
.account-secondary-link {
  border-color: var(--border);
  background: var(--surface);
  color: var(--fg);
}

.account-button:disabled,
.account-panel button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.account-mobile-tabs {
  display: none;
}

@media (max-width: 900px) {
  .account-sidebar {
    display: none;
  }

  .account-main {
    margin-left: 0;
    padding: 22px 18px 84px;
  }

  .account-mobile-tabs {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    border-top: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(12px);
  }

  .account-mobile-tabs a {
    min-height: 58px;
    display: grid;
    place-items: center;
    gap: 2px;
    color: var(--muted);
    font-size: 0.68rem;
    font-weight: 700;
  }

  .account-mobile-tabs a.active {
    color: var(--accent);
  }

  .account-stats-grid,
  .account-action-grid,
  .account-product-grid {
    grid-template-columns: 1fr;
  }

  .account-page-heading,
  .account-card-header,
  .account-list-row {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

- [ ] **Step 5: Run typecheck**

Run:

```bash
npm run typecheck -w apps/web
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/package.json package-lock.json apps/web/src/components/account/AccountShell.tsx apps/web/src/components/account/AccountUi.tsx apps/web/src/app/globals.css
git commit -m "feat: add account center shell"
```

## Task 4: Rebuild Login and Account Overview

**Files:**
- Modify: `apps/web/src/app/login/page.tsx`
- Modify: `apps/web/src/app/account/page.tsx`

- [ ] **Step 1: Rewrite the email-only login page**

Replace `apps/web/src/app/login/page.tsx` with:

```tsx
import Link from "next/link";
import { requestEmailLogin } from "@/lib/auth/actions";
import { sanitizeReturnUrl } from "@/lib/account/account-security";

type LoginPageProps = {
  searchParams?: Promise<{
    returnUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const returnUrl = sanitizeReturnUrl(params?.returnUrl);

  return (
    <main className="account-auth-page">
      <section className="account-auth-panel">
        <Link className="account-auth-logo" href="/tools">
          <span className="account-logo-mark">D</span>
          <span>统一中心</span>
        </Link>
        <p className="account-kicker">EMAIL SIGN-IN</p>
        <h1>欢迎回来</h1>
        <p className="account-auth-copy">使用注册邮箱和密码登录。新账号需要先完成邮箱验证，验证邮件只在注册阶段发送。</p>

        <form action={requestEmailLogin} className="account-auth-form">
          <input name="returnUrl" type="hidden" value={returnUrl} />
          <label htmlFor="email">邮箱</label>
          <input id="email" name="email" placeholder="you@example.com" required type="email" />
          <button type="submit">登录账号</button>
        </form>

        <p className="account-auth-note">密码、短信和社交登录会在对应安全能力上线后加入。</p>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Rewrite account overview**

Replace `apps/web/src/app/account/page.tsx` with:

```tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { ensureDefaultProducts, getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial, buildSecuritySummary, formatAccountDate } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountPage() {
  const sessionUser = await requireUser();
  const [account, products] = await Promise.all([getAccountDashboard(sessionUser.email), ensureDefaultProducts()]);

  if (!account) {
    redirect("/login?returnUrl=/account");
  }

  const initial = buildAccountInitial(account.name, account.email);
  const security = buildSecuritySummary({
    auditLogCount: account.auditLogs.length,
    emailVerified: Boolean(account.emailVerified)
  });

  return (
    <AccountShell email={account.email} initial={initial} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Account Center</p>
          <h1>下午好，{account.name}</h1>
          <p className="account-muted">统一管理 DreamChasers 主站、AI 能力和产品型工具入口。</p>
        </div>
        <Link className="account-button secondary" href="/account/profile">编辑资料</Link>
      </header>

      <div className="account-stats-grid">
        <div className="account-stat">
          <p className="account-muted">安全等级</p>
          <h2>{security.level}</h2>
          <p className="account-muted">{security.description}</p>
        </div>
        <div className="account-stat">
          <p className="account-muted">AI 积分</p>
          <h2>{account.creditBalance}</h2>
          <p className="account-muted">来自平台权益账本。</p>
        </div>
        <div className="account-stat">
          <p className="account-muted">产品接入</p>
          <h2>{products.length}</h2>
          <p className="account-muted">可生成一次性产品 token。</p>
        </div>
      </div>

      <AccountSection eyebrow="Quick Actions" title="快捷操作">
        <div className="account-action-grid">
          <Link className="account-action" href="/account/security">
            <strong>账号安全</strong>
            <p className="account-muted">查看邮箱验证、审计记录和退出登录。</p>
          </Link>
          <Link className="account-action" href="/account/ai/credits">
            <strong>积分管理</strong>
            <p className="account-muted">查看余额、配额和 AI 使用账本。</p>
          </Link>
          <Link className="account-action" href="/account/products">
            <strong>产品接入</strong>
            <p className="account-muted">为 TimePick 等产品生成短时 token。</p>
          </Link>
        </div>
      </AccountSection>

      <AccountSection eyebrow="Recent Activity" title="最近审计记录">
        <div className="account-list">
          {account.auditLogs.length === 0 ? <p className="account-empty">暂无审计记录。</p> : null}
          {account.auditLogs.map((log) => (
            <div className="account-list-row" key={log.id}>
              <strong>{log.action}</strong>
              <span>{formatAccountDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
      </AccountSection>

      <AccountSection eyebrow="Status" title="账号状态">
        <AccountStatusPill tone={account.emailVerified ? "success" : "warning"}>
          {account.emailVerified ? "邮箱已验证" : "等待邮箱验证"}
        </AccountStatusPill>
      </AccountSection>
    </AccountShell>
  );
}
```

- [ ] **Step 3: Run account tests and typecheck**

Run:

```bash
npm run test -w apps/web -- account
npm run typecheck -w apps/web
```

Expected: both PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/login/page.tsx apps/web/src/app/account/page.tsx
git commit -m "feat: rebuild account login and overview"
```

## Task 5: Add Profile, Security, and Devices Pages

**Files:**
- Create: `apps/web/src/app/account/profile/page.tsx`
- Modify: `apps/web/src/app/account/security/page.tsx`
- Create: `apps/web/src/app/account/devices/page.tsx`

- [ ] **Step 1: Add profile page**

Create `apps/web/src/app/account/profile/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountProfilePage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/profile");
  }

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Profile</p>
          <h1>个人信息</h1>
          <p className="account-muted">第一阶段展示统一账号资料；昵称编辑、手机号和实名能力分任务开放。</p>
        </div>
      </header>

      <AccountSection title="头像与昵称">
        <div className="account-list-row">
          <span className="account-avatar">{buildAccountInitial(account.name, account.email)}</span>
          <div>
            <strong>{account.name}</strong>
            <p className="account-muted">昵称编辑会接入 UserProfile。</p>
          </div>
        </div>
      </AccountSection>

      <AccountSection title="联系方式">
        <div className="account-list">
          <div className="account-list-row">
            <strong>邮箱</strong>
            <span>{account.email}</span>
          </div>
          <div className="account-list-row">
            <strong>手机号</strong>
            <AccountStatusPill>未绑定</AccountStatusPill>
          </div>
        </div>
      </AccountSection>

      <AccountSection title="实名信息">
        <div className="account-list-row">
          <strong>认证状态</strong>
          <AccountStatusPill>未开放</AccountStatusPill>
        </div>
      </AccountSection>
    </AccountShell>
  );
}
```

- [ ] **Step 2: Rewrite security page**

Replace `apps/web/src/app/account/security/page.tsx` with:

```tsx
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { signOutCurrentUser } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";
import { buildAccountInitial, buildSecuritySummary, formatAccountDate } from "@/lib/account/account-view-model";

export default async function AccountSecurityPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/security");
  }

  const security = buildSecuritySummary({
    auditLogCount: account.auditLogs.length,
    emailVerified: Boolean(account.emailVerified)
  });

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Security</p>
          <h1>账号安全</h1>
          <p className="account-muted">{security.description}</p>
        </div>
        <form action={signOutCurrentUser}>
          <button className="account-button secondary" type="submit">退出登录</button>
        </form>
      </header>

      <AccountSection title="安全能力">
        <div className="account-list">
          <div className="account-list-row"><strong>邮箱验证</strong><AccountStatusPill tone="success">已启用</AccountStatusPill></div>
          <div className="account-list-row"><strong>注册验证邮件冷却</strong><AccountStatusPill tone="success">已启用</AccountStatusPill></div>
          <div className="account-list-row"><strong>密码登录</strong><AccountStatusPill>未启用</AccountStatusPill></div>
          <div className="account-list-row"><strong>手机号</strong><AccountStatusPill>未绑定</AccountStatusPill></div>
          <div className="account-list-row"><strong>二步验证</strong><AccountStatusPill>未开放</AccountStatusPill></div>
        </div>
      </AccountSection>

      <AccountSection title="审计记录">
        <div className="account-list">
          {account.auditLogs.length === 0 ? <p className="account-empty">暂无审计记录。</p> : null}
          {account.auditLogs.map((log) => (
            <div className="account-list-row" key={log.id}>
              <strong>{log.action}</strong>
              <span>{formatAccountDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
      </AccountSection>
    </AccountShell>
  );
}
```

- [ ] **Step 3: Add devices page**

Create `apps/web/src/app/account/devices/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial, formatAccountDate, toDeviceRows } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountDevicesPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/devices");
  }

  const deviceRows = toDeviceRows(account.auditLogs);

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Devices</p>
          <h1>登录设备</h1>
          <p className="account-muted">第一阶段根据安全审计记录展示近期会话，设备强制下线会在 session 管理 API 完成后开放。</p>
        </div>
      </header>

      <AccountSection title="当前设备">
        <div className="account-list-row">
          <div>
            <strong>当前网页登录</strong>
            <p className="account-muted">{account.email}</p>
          </div>
          <AccountStatusPill tone="success">当前会话</AccountStatusPill>
        </div>
      </AccountSection>

      <AccountSection title="近期记录">
        <div className="account-list">
          {deviceRows.length === 0 ? <p className="account-empty">暂无近期登录记录。</p> : null}
          {deviceRows.map((row) => (
            <div className="account-list-row" key={row.id}>
              <div>
                <strong>{row.name}</strong>
                <p className="account-muted">{row.location}</p>
              </div>
              <span>{formatAccountDate(row.time)}</span>
            </div>
          ))}
        </div>
      </AccountSection>
    </AccountShell>
  );
}
```

- [ ] **Step 4: Run validation**

Run:

```bash
npm run test -w apps/web -- account-view-model
npm run typecheck -w apps/web
```

Expected: both PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/account/profile/page.tsx apps/web/src/app/account/security/page.tsx apps/web/src/app/account/devices/page.tsx
git commit -m "feat: add account profile security devices pages"
```

## Task 6: Add AI Credits, Recharge, Subscription, and LLM Config Pages

**Files:**
- Create: `apps/web/src/app/account/ai/credits/page.tsx`
- Create: `apps/web/src/app/account/ai/recharge/page.tsx`
- Create: `apps/web/src/app/account/ai/subscription/page.tsx`
- Create: `apps/web/src/app/account/ai/llm-config/page.tsx`
- Modify: `apps/web/src/app/account/ai/page.tsx`
- Modify: `apps/web/src/app/account/billing/page.tsx`

- [ ] **Step 1: Add AI credits page**

Create `apps/web/src/app/account/ai/credits/page.tsx`:

```tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial, formatAccountDate } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountAiCreditsPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/ai/credits");
  }

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">AI Credits</p>
          <h1>积分管理</h1>
          <p className="account-muted">平台 AI 能力统一从权益账本读取余额和使用记录。</p>
        </div>
        <Link className="account-button" href="/account/ai/recharge">充值中心</Link>
      </header>

      <AccountSection title="当前余额">
        <div className="account-stat">
          <p className="account-muted">Platform Credits</p>
          <h2>{account.creditBalance} 积分</h2>
          <p className="account-muted">第一阶段只展示账本，不接真实支付。</p>
        </div>
      </AccountSection>

      <AccountSection title="最近 AI 和账号记录">
        <div className="account-list">
          {account.auditLogs.length === 0 ? <p className="account-empty">暂无记录。</p> : null}
          {account.auditLogs.map((log) => (
            <div className="account-list-row" key={log.id}>
              <strong>{log.action}</strong>
              <span>{formatAccountDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
      </AccountSection>
    </AccountShell>
  );
}
```

- [ ] **Step 2: Add recharge page**

Create `apps/web/src/app/account/ai/recharge/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

const plans = [
  { credits: "1,000", detail: "适合临时试用", price: "10 元" },
  { credits: "5,000", detail: "适合轻度 AI 工具使用", price: "45 元" },
  { credits: "10,000", detail: "适合常用 AI 处理", price: "80 元" },
  { credits: "50,000", detail: "适合批量任务和团队前期验证", price: "350 元" }
];

export default async function AccountAiRechargePage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/ai/recharge");
  }

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Recharge</p>
          <h1>充值中心</h1>
          <p className="account-muted">支付链路尚未开放，当前页面用于展示商业化结构。</p>
        </div>
        <AccountStatusPill>暂未开放</AccountStatusPill>
      </header>

      <AccountSection title="积分套餐">
        <div className="account-product-grid">
          {plans.map((plan) => (
            <div className="account-stat" key={plan.credits}>
              <h2>{plan.credits} 积分</h2>
              <p className="account-muted">{plan.detail}</p>
              <strong>{plan.price}</strong>
            </div>
          ))}
        </div>
      </AccountSection>

      <button className="account-button" disabled type="button">支付能力暂未开放</button>
    </AccountShell>
  );
}
```

- [ ] **Step 3: Add subscription page**

Create `apps/web/src/app/account/ai/subscription/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

const tiers = [
  { name: "Free", price: "0 / 月", summary: "基础免费工具和少量 AI 试用额度" },
  { name: "Pro", price: "29 / 月", summary: "更多 AI 积分、常用模型优先级和批量额度" },
  { name: "Team", price: "99 / 月", summary: "团队成员、共享额度和审计导出" }
];

export default async function AccountAiSubscriptionPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/ai/subscription");
  }

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Subscription</p>
          <h1>订阅管理</h1>
          <p className="account-muted">第一阶段不接自动扣费，套餐用于说明后续权益结构。</p>
        </div>
        <AccountStatusPill tone="success">当前 Free</AccountStatusPill>
      </header>

      <AccountSection title="套餐对比">
        <div className="account-product-grid">
          {tiers.map((tier) => (
            <div className="account-stat" key={tier.name}>
              <h2>{tier.name}</h2>
              <strong>{tier.price}</strong>
              <p className="account-muted">{tier.summary}</p>
            </div>
          ))}
        </div>
      </AccountSection>
    </AccountShell>
  );
}
```

- [ ] **Step 4: Add LLM config page**

Create `apps/web/src/app/account/ai/llm-config/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSection, AccountStatusPill } from "@/components/account/AccountUi";
import { aiCredentialSources, getPhaseTwoCredentialSources } from "@/lib/account/account-ai-config";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountAiLlmConfigPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/ai/llm-config");
  }

  const phaseTwoSources = getPhaseTwoCredentialSources();

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">LLM Config</p>
          <h1>LLM 配置</h1>
          <p className="account-muted">这里管理模型来源和偏好；真实调用、扣费、日志和 provider 协议由 AI Gateway 承接。</p>
        </div>
      </header>

      <AccountSection title="第二阶段优先模型来源">
        <div className="account-list">
          {phaseTwoSources.map((source) => (
            <div className="account-list-row" key={source.id}>
              <div>
                <strong>{source.label}</strong>
                <p className="account-muted">{source.description}</p>
              </div>
              <AccountStatusPill tone="accent">第二阶段</AccountStatusPill>
            </div>
          ))}
        </div>
      </AccountSection>

      <AccountSection title="完整模型来源蓝图">
        <div className="account-list">
          {aiCredentialSources.map((source) => (
            <div className="account-list-row" key={source.id}>
              <div>
                <strong>{source.label}</strong>
                <p className="account-muted">{source.description}</p>
              </div>
              <AccountStatusPill tone={source.storesProviderKey ? "warning" : "success"}>
                {source.storesProviderKey ? "需要密钥治理" : "不保存明文 Key"}
              </AccountStatusPill>
            </div>
          ))}
        </div>
      </AccountSection>
    </AccountShell>
  );
}
```

- [ ] **Step 5: Redirect old AI and billing routes**

Replace `apps/web/src/app/account/ai/page.tsx` with:

```tsx
import { redirect } from "next/navigation";

export default function AccountAiPage() {
  redirect("/account/ai/llm-config");
}
```

Replace `apps/web/src/app/account/billing/page.tsx` with:

```tsx
import { redirect } from "next/navigation";

export default function AccountBillingPage() {
  redirect("/account/ai/credits");
}
```

- [ ] **Step 6: Run validation**

Run:

```bash
npm run test -w apps/web -- account-ai-config
npm run typecheck -w apps/web
```

Expected: both PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/app/account/ai apps/web/src/app/account/billing/page.tsx
git commit -m "feat: add account AI center pages"
```

## Task 7: Move API Keys and Product Tokens Into the New Shell

**Files:**
- Modify: `apps/web/src/app/account/api-keys/page.tsx`
- Create: `apps/web/src/app/account/products/page.tsx`
- Modify: `apps/web/src/components/account/ApiKeyManager.tsx`
- Modify: `apps/web/src/components/account/ProductSessionManager.tsx`

- [ ] **Step 1: Wrap API key page in AccountShell**

Replace `apps/web/src/app/account/api-keys/page.tsx` with:

```tsx
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { ApiKeyManager } from "@/components/account/ApiKeyManager";
import { getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountApiKeysPage() {
  const sessionUser = await requireUser();
  const account = await getAccountDashboard(sessionUser.email);

  if (!account) {
    redirect("/login?returnUrl=/account/api-keys");
  }

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Developer</p>
          <h1>API Key</h1>
          <p className="account-muted">平台 API Key 用于调用 DreamChasers API，不等同于用户自带模型 API Key。</p>
        </div>
      </header>
      <ApiKeyManager initialApiKeys={account.apiKeys} />
    </AccountShell>
  );
}
```

- [ ] **Step 2: Create products page**

Create `apps/web/src/app/account/products/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { ProductSessionManager } from "@/components/account/ProductSessionManager";
import { ensureDefaultProducts, getAccountDashboard } from "@/lib/account/account-data";
import { buildAccountInitial } from "@/lib/account/account-view-model";
import { requireUser } from "@/lib/auth/session";

export default async function AccountProductsPage() {
  const sessionUser = await requireUser();
  const [account, products] = await Promise.all([getAccountDashboard(sessionUser.email), ensureDefaultProducts()]);

  if (!account) {
    redirect("/login?returnUrl=/account/products");
  }

  return (
    <AccountShell email={account.email} initial={buildAccountInitial(account.name, account.email)} name={account.name}>
      <header className="account-page-heading">
        <div>
          <p className="account-kicker">Products</p>
          <h1>产品型工具接入</h1>
          <p className="account-muted">为 TimePick、镜界等独立产品生成短时一次性 token。</p>
        </div>
      </header>
      <ProductSessionManager products={products.map((product) => ({ name: product.name, slug: product.slug }))} />
    </AccountShell>
  );
}
```

- [ ] **Step 3: Rename manager outer class names**

In `apps/web/src/components/account/ApiKeyManager.tsx`, change the outer section class from `account-panel` to `account-card`, and keep the existing form logic.

In `apps/web/src/components/account/ProductSessionManager.tsx`, change the outer section class from `account-panel` to `account-card`, and keep the existing fetch logic.

- [ ] **Step 4: Run validation**

Run:

```bash
npm run test -w apps/web -- product-session account
npm run typecheck -w apps/web
```

Expected: both PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/account/api-keys/page.tsx apps/web/src/app/account/products/page.tsx apps/web/src/components/account/ApiKeyManager.tsx apps/web/src/components/account/ProductSessionManager.tsx
git commit -m "feat: add account developer and product pages"
```

## Task 8: Browser QA and Documentation

**Files:**
- Modify: implementation task item and claim files assigned when executing this plan.
- Modify: `docs/progress/YYYY-MM-DD-lee.md`
- Create: `docs/completion/YYYY-MM-DD-task-TXXX-account-center-redesign.md`

- [ ] **Step 1: Run full app validation**

Run:

```bash
npm run lint -w apps/web
npm run typecheck -w apps/web
npm run build -w apps/web
```

Expected: all PASS.

- [ ] **Step 2: Start dev server**

Run:

```bash
npm run dev -w apps/web
```

Expected: server prints a local URL, normally `http://localhost:3000`.

- [ ] **Step 3: Check desktop routes**

Use Kimi WebBridge or the Codex App browser. Visit:

```text
http://localhost:3000/login
http://localhost:3000/account
http://localhost:3000/account/profile
http://localhost:3000/account/security
http://localhost:3000/account/devices
http://localhost:3000/account/ai/credits
http://localhost:3000/account/ai/recharge
http://localhost:3000/account/ai/subscription
http://localhost:3000/account/ai/llm-config
http://localhost:3000/account/api-keys
http://localhost:3000/account/products
```

Expected:

- Unauthenticated account routes redirect to `/login`.
- After email login, each route renders inside the account shell.
- Sidebar active state matches the current page.
- Disabled payment/subscription/model actions are visually disabled and do not claim success.
- No text overlaps or horizontal scrolling at 1440x900.

- [ ] **Step 4: Check mobile routes**

Use viewport 390x844 and 430x932. Visit:

```text
http://localhost:3000/login
http://localhost:3000/account
http://localhost:3000/account/ai/llm-config
```

Expected:

- Login form fits without horizontal scrolling.
- Account sidebar is hidden.
- Mobile bottom tabs are visible.
- Cards stack into one column.
- Long email and token text wrap.

- [ ] **Step 5: Update task docs**

Update the implementation task item, claim, progress, and completion record with:

```md
- Implemented account shell and Open Design-derived account center pages.
- First phase uses email registration verification and email-password login.
- LLM config page maps T108 AI Gateway credential sources and does not store provider keys.
- Verification passed: lint, typecheck, build, account tests, desktop browser check, mobile browser check.
```

- [ ] **Step 6: Run docs validation**

Run:

```bash
npm run docs:sync
git diff --check
```

Expected: both PASS.

- [ ] **Step 7: Commit**

```bash
git add docs/tasks docs/status docs/progress docs/completion
git commit -m "docs: record account center redesign implementation"
```

## Self-Review

- Spec coverage: T133 sections are covered by Task 1 navigation, Task 2 view models, Task 3 shell/styles, Task 4 login/overview, Task 5 profile/security/devices, Task 6 AI pages and LLM config, Task 7 API key/product pages, and Task 8 verification/docs.
- Scope split: real AI Gateway calls, external Gateway BYOK persistence, encrypted Key Vault, local connector, payment, subscription mutation, password, SMS, OAuth, MFA, real-name verification, and forced device logout are intentionally excluded from phase one and require separate tasks.
- Type consistency: `AccountNavItem`, `AiCredentialSourceView`, `buildAccountInitial`, `buildSecuritySummary`, `formatAccountDate`, and `toDeviceRows` are introduced before use.
- Placeholder scan: no plan step uses placeholder wording that leaves behavior undefined.
