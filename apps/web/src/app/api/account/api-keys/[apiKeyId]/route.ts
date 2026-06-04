import { NextResponse } from "next/server";
import { revokePlatformApiKeyForEmail } from "@/lib/account/account-data";
import { getCurrentUser } from "@/lib/auth/session";

type ApiKeyRouteProps = {
  params: Promise<{
    apiKeyId: string;
  }>;
};

export async function DELETE(_request: Request, { params }: ApiKeyRouteProps) {
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const { apiKeyId } = await params;
  await revokePlatformApiKeyForEmail(user.email, apiKeyId);

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
