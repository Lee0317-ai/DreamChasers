export type AccountNavItem = {
  href: string;
  icon: "layout-dashboard" | "user" | "shield" | "coins" | "key" | "boxes";
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
      { href: "/account/security", icon: "shield", label: "账号安全" }
    ],
    label: "账号"
  },
  {
    items: [
      { href: "/account/ai/credits", icon: "coins", label: "积分管理" }
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
    .filter((item) => pathname === item.href || (item.href !== "/account" && pathname.startsWith(`${item.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0];
}
