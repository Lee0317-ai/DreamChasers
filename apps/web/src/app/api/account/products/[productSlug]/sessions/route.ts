import { NextResponse } from "next/server";
import { createProductSessionForEmail } from "@/lib/account/account-data";
import { getCurrentUser } from "@/lib/auth/session";

type ProductSessionRouteProps = {
  params: Promise<{
    productSlug: string;
  }>;
};

export async function POST(request: Request, { params }: ProductSessionRouteProps) {
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const { productSlug } = await params;
  const payload = (await request.json().catch(() => null)) as { returnUrl?: string } | null;
  const result = await createProductSessionForEmail(user.email, productSlug, payload?.returnUrl || "/account");

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-store"
    },
    status: 201
  });
}
