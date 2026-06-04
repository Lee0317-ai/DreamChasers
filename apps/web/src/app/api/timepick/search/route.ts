import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getTimePickUserIdByEmail, searchTimePickResources } from "@/lib/timepick/timepick-api";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function GET(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword") ?? "";
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await searchTimePickResources({
    keyword,
    userId
  });

  if (!result.resources) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json(
    { resources: result.resources },
    {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store"
      }
    }
  );
}
