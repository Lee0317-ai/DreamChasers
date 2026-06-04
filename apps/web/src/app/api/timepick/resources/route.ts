import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";
import {
  createTimePickResource,
  getTimePickUserIdByEmail,
  listTimePickResourceView,
  type TimePickDisplayMode,
  type TimePickSelectedType
} from "@/lib/timepick/timepick-api";

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
  const selectedType = parseSelectedType(url.searchParams.get("selectedType"));
  const displayMode = parseDisplayMode(url.searchParams.get("displayMode"));
  const folderId = url.searchParams.get("folderId");
  const userId = await getTimePickUserIdByEmail(user.email);
  const view = await listTimePickResourceView({
    displayMode,
    folderId,
    selectedType,
    userId
  });

  return NextResponse.json(view, {
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store"
    }
  });
}

export async function POST(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const body = await request.json();
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await createTimePickResource({
    input: body,
    userId
  });

  if (!result.resource) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ resource: result.resource }, { headers: corsHeaders, status: result.status });
}

function parseSelectedType(value: string | null): TimePickSelectedType {
  return value === "folder" || value === "tags" ? value : "all";
}

function parseDisplayMode(value: string | null): TimePickDisplayMode {
  return value === "resource-only" ? "resource-only" : "folder-and-resource";
}
