"use client";

import { useState, useTransition } from "react";

type ProductSessionManagerProps = {
  products: {
    name: string;
    slug: string;
  }[];
};

type CreatedSession = {
  expiresAt: string;
  productName: string;
  token: string;
};

export function ProductSessionManager({ products }: ProductSessionManagerProps) {
  const [createdSession, setCreatedSession] = useState<CreatedSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function createSession(productSlug: string) {
    startTransition(async () => {
      setError(null);
      const response = await fetch(`/api/account/products/${productSlug}/sessions`, {
        body: JSON.stringify({ returnUrl: "/account" }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });
      const payload = (await response.json()) as CreatedSession & { error?: string };

      if (!response.ok || !payload.token) {
        setError(payload.error || "生成产品 token 失败。");
        return;
      }

      setCreatedSession(payload);
    });
  }

  return (
    <section className="account-panel">
      <div className="account-panel-heading">
        <div>
          <p className="account-eyebrow">Products</p>
          <h2>产品型工具接入</h2>
        </div>
      </div>
      <div className="account-product-grid">
        {products.map((product) => (
          <div key={product.slug}>
            <strong>{product.name}</strong>
            <span>生成 10 分钟有效的一次性产品 token。</span>
            <button disabled={isPending} onClick={() => createSession(product.slug)} type="button">
              生成 token
            </button>
          </div>
        ))}
      </div>
      {createdSession ? (
        <div className="account-secret-box">
          <span>{createdSession.productName} token 只展示一次，过期时间：{new Date(createdSession.expiresAt).toLocaleString("zh-CN")}</span>
          <code>{createdSession.token}</code>
        </div>
      ) : null}
      {error ? <p className="account-error">{error}</p> : null}
    </section>
  );
}
