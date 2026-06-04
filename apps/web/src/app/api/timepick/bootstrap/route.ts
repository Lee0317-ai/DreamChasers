import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";
import { getTimePickBootstrapForEmail } from "@/lib/timepick/timepick-data";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function GET(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const bootstrap = await getTimePickBootstrapForEmail(user.email);

  return NextResponse.json(bootstrap, {
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store"
    }
  });
}
