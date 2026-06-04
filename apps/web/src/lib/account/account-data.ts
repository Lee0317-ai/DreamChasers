import { db } from "@/lib/db";
import {
  buildApiKeyHint,
  computeCreditBalance,
  generatePlatformApiKeySecret,
  hashPlatformApiKey,
  sanitizeReturnUrl
} from "./account-security";
import {
  buildProductSessionExpiry,
  canConsumeProductSession,
  defaultProducts,
  generateProductSessionToken,
  hashProductSessionToken,
  isRegisteredProductSlug
} from "./product-session";

export async function findAccountUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email }
  });
}

export async function getAccountDashboard(email: string) {
  const user = await db.user.findUnique({
    include: {
      apiKeys: {
        orderBy: { createdAt: "desc" },
        take: 10
      },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        take: 8
      },
      creditWallets: {
        include: {
          ledger: {
            orderBy: { createdAt: "desc" },
            take: 20
          }
        }
      },
      profile: true
    },
    where: { email }
  });

  if (!user) {
    return null;
  }

  const platformWallet = user.creditWallets.find((wallet) => wallet.scope === "platform");
  const creditBalance = platformWallet ? computeCreditBalance(platformWallet.ledger) : 0;

  return {
    apiKeys: user.apiKeys.map((apiKey) => ({
      createdAt: apiKey.createdAt,
      id: apiKey.id,
      keyHint: apiKey.keyHint,
      lastUsedAt: apiKey.lastUsedAt,
      name: apiKey.name,
      revokedAt: apiKey.revokedAt
    })),
    auditLogs: user.auditLogs.map((log) => ({
      action: log.action,
      createdAt: log.createdAt,
      id: log.id
    })),
    creditBalance,
    email: user.email,
    emailVerified: user.emailVerified,
    id: user.id,
    name: user.profile?.displayName || user.name || "未设置昵称"
  };
}

export async function createPlatformApiKeyForEmail(email: string, name: string) {
  const user = await findAccountUserByEmail(email);

  if (!user) {
    throw new Error("账号不存在，请重新登录。");
  }

  const secret = generatePlatformApiKeySecret();
  const apiKey = await db.platformApiKey.create({
    data: {
      keyHash: hashPlatformApiKey(secret),
      keyHint: buildApiKeyHint(secret),
      name: name.trim() || "默认 API Key",
      userId: user.id
    }
  });

  await recordAccountAuditLog(user.id, "api_key_created");

  return {
    apiKey: {
      createdAt: apiKey.createdAt,
      id: apiKey.id,
      keyHint: apiKey.keyHint,
      name: apiKey.name
    },
    secret
  };
}

export async function revokePlatformApiKeyForEmail(email: string, apiKeyId: string) {
  const user = await findAccountUserByEmail(email);

  if (!user) {
    throw new Error("账号不存在，请重新登录。");
  }

  await db.platformApiKey.update({
    data: {
      revokedAt: new Date()
    },
    where: {
      id: apiKeyId,
      userId: user.id
    }
  });

  await recordAccountAuditLog(user.id, "api_key_revoked");
}

export async function canCreateProductSessionForEmail(email: string, productSlug: string, returnUrl: string) {
  const user = await findAccountUserByEmail(email);
  const product = await db.product.findUnique({
    where: { slug: productSlug }
  });

  return Boolean(user && product && sanitizeReturnUrl(returnUrl) === returnUrl);
}

export async function ensureDefaultProducts() {
  return Promise.all(
    defaultProducts.map((product) =>
      db.product.upsert({
        create: {
          name: product.name,
          slug: product.slug
        },
        update: {
          name: product.name,
          status: "active"
        },
        where: {
          slug: product.slug
        }
      })
    )
  );
}

export async function createProductSessionForEmail(email: string, productSlug: string, returnUrl: string) {
  if (!isRegisteredProductSlug(productSlug)) {
    throw new Error("未知产品。");
  }

  const safeReturnUrl = sanitizeReturnUrl(returnUrl);

  if (safeReturnUrl !== returnUrl) {
    throw new Error("产品回跳地址不安全。");
  }

  const user = await findAccountUserByEmail(email);

  if (!user) {
    throw new Error("账号不存在，请重新登录。");
  }

  const product = await db.product.upsert({
    create: {
      name: defaultProducts.find((item) => item.slug === productSlug)?.name || productSlug,
      slug: productSlug
    },
    update: {},
    where: {
      slug: productSlug
    }
  });
  const token = generateProductSessionToken();
  const expiresAt = buildProductSessionExpiry();

  await db.productSession.create({
    data: {
      expiresAt,
      productId: product.id,
      returnUrl: safeReturnUrl,
      tokenHash: hashProductSessionToken(token),
      userId: user.id
    }
  });

  await recordAccountAuditLog(user.id, "product_session_created");

  return {
    expiresAt,
    productName: product.name,
    token
  };
}

export async function consumeProductSessionToken(productSlug: string, token: string) {
  if (!isRegisteredProductSlug(productSlug)) {
    throw new Error("产品 token 无效。");
  }

  const tokenHash = hashProductSessionToken(token);
  const productSession = await db.productSession.findUnique({
    include: {
      product: true,
      user: true
    },
    where: {
      tokenHash
    }
  });

  if (
    !productSession ||
    !canConsumeProductSession({
      consumedAt: productSession.consumedAt,
      expiresAt: productSession.expiresAt,
      productSlug: productSession.product.slug,
      requestedProductSlug: productSlug
    })
  ) {
    throw new Error("产品 token 无效。");
  }

  const consumedAt = new Date();
  await db.productSession.update({
    data: {
      consumedAt
    },
    where: {
      id: productSession.id
    }
  });

  return {
    consumedAt,
    email: productSession.user.email,
    productSlug: productSession.product.slug,
    userId: productSession.user.id
  };
}

export async function recordAccountAuditLog(userId: string | null, action: Parameters<typeof db.accountAuditLog.create>[0]["data"]["action"]) {
  await db.accountAuditLog.create({
    data: {
      action,
      userId
    }
  });
}
