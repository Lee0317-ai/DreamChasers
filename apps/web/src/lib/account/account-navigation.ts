export type AccountNavItem = {
  href: string;
  icon: "layout-dashboard" | "user" | "shield" | "monitor" | "coins" | "credit-card" | "badge" | "bot" | "key" | "boxes";
  label: string;
};

export type AccountNavGroup = {
  items: AccountNavItem[];
  label: string;
};

export const accountNavGroups: AccountNavGroup[] = [
  {
    items: [
      { href: "/account", icon: "layout-dashboard", label: "账号概览" },
      { href: "/account/profile", icon: "user", label: "个人信息" },
      { href: "/account/security", icon: "shield", label: "账号安全" },
      { href: "/account/devices", icon: "monitor", label: "登录设备" }
    ],
    label: "账号"
  },
  {
    items: [
      { href: "/account/ai/credits", icon: "coins", label: "积分管理" },
      { href: "/account/ai/recharge", icon: "credit-card", label: "充值中心" },
      { href: "/account/ai/subscription", icon: "badge", label: "订阅管理" },
      { href: "/account/ai/llm-config", icon: "bot", label: "LLM 配置" }
    ],
    label: "AI 能力"
  },
  {
    items: [
      { href: "/account/api-keys", icon: "key", label: "API Key" },
      { href: "/account/products", icon: "boxes", label: "产品接入" }
    ],
    label: "开发者和产品"
  }
];

export function findActiveAccountNavItem(pathname: string) {
  const allItems = accountNavGroups.flatMap((group) => group.items);

  return allItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
}
