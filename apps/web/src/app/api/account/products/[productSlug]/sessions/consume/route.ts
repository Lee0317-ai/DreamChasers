import { NextResponse } from "next/server";
import { consumeProductSessionToken } from "@/lib/account/account-data";

type ProductSessionConsumeRouteProps = {
  params: Promise<{
    productSlug: string;
  }>;
};

export async function POST(request: Request, { params }: ProductSessionConsumeRouteProps) {
  const { productSlug } = await params;
  const payload = (await request.json().catch(() => null)) as { token?: string } | null;

  if (!payload?.token) {
    return NextResponse.json({ error: "产品 token 无效。" }, { status: 400 });
  }

  try {
    const result = await consumeProductSessionToken(productSlug, payload.token);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return NextResponse.json({ error: "产品 token 无效。" }, { status: 400 });
  }
}
