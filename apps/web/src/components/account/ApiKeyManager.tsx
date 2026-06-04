"use client";

import { useState, useTransition } from "react";

type ApiKeyItem = {
  createdAt: Date | string;
  id: string;
  keyHint: string;
  name: string;
  revokedAt: Date | string | null;
};

type ApiKeyManagerProps = {
  initialApiKeys: ApiKeyItem[];
};

export function ApiKeyManager({ initialApiKeys }: ApiKeyManagerProps) {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function createApiKey(formData: FormData) {
    const name = String(formData.get("name") || "默认 API Key");

    startTransition(async () => {
      setError(null);
      const response = await fetch("/api/account/api-keys", {
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });

      const payload = (await response.json()) as {
        apiKey?: ApiKeyItem;
        error?: string;
        secret?: string;
      };

      if (!response.ok || !payload.apiKey || !payload.secret) {
        setError(payload.error || "创建 API Key 失败。");
        return;
      }

      setCreatedSecret(payload.secret);
      setApiKeys([payload.apiKey, ...apiKeys]);
    });
  }

  function revokeApiKey(apiKeyId: string) {
    startTransition(async () => {
      setError(null);
      const response = await fetch(`/api/account/api-keys/${apiKeyId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        setError("停用 API Key 失败。");
        return;
      }

      setApiKeys(apiKeys.map((apiKey) => (apiKey.id === apiKeyId ? { ...apiKey, revokedAt: new Date().toISOString() } : apiKey)));
    });
  }

  return (
    <section className="account-card">
      <div className="account-panel-heading">
        <div>
          <p className="account-eyebrow">Platform API Key</p>
          <h2>平台 API Key</h2>
        </div>
      </div>

      <form action={createApiKey} className="account-inline-form">
        <input name="name" placeholder="例如：本地脚本" />
        <button disabled={isPending} type="submit">
          创建 Key
        </button>
      </form>

      {createdSecret ? (
        <div className="account-secret-box">
          <span>只展示一次</span>
          <code>{createdSecret}</code>
        </div>
      ) : null}

      {error ? <p className="account-error">{error}</p> : null}

      <div className="account-list">
        {apiKeys.length === 0 ? <p className="account-muted">还没有创建 API Key。</p> : null}
        {apiKeys.map((apiKey) => (
          <div className="account-list-row" key={apiKey.id}>
            <div>
              <strong>{apiKey.name}</strong>
              <span>{apiKey.keyHint}</span>
            </div>
            {apiKey.revokedAt ? (
              <span className="account-badge">已停用</span>
            ) : (
              <button disabled={isPending} onClick={() => revokeApiKey(apiKey.id)} type="button">
                停用
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
