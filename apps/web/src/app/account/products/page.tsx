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
