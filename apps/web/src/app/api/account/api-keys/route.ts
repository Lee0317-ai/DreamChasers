import { NextResponse } from "next/server";
import { createPlatformApiKeyForEmail } from "@/lib/account/account-data";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { name?: string } | null;
  const result = await createPlatformApiKeyForEmail(user.email, payload?.name || "默认 API Key");

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-store"
    },
    status: 201
  });
}
