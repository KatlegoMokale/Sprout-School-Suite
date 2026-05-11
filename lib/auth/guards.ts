import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";

export async function requireAuth(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export async function requirePermission(request: NextRequest, permission: string) {
  const auth = await requireAuth(request);
  if ("error" in auth) return auth;

  if (auth.session.role !== "admin" && !auth.session.permissions.includes(permission)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return auth;
}
