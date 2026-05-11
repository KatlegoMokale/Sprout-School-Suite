import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User, { UserRole } from "@/lib/models/user.model";
import { requirePermission } from "@/lib/auth/guards";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/auth/permissions";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requirePermission(request, "users:manage");
  if ("error" in auth) return auth.error;

  const { role, permissions, isActive } = await request.json();
  await connectToDatabase();

  const updates: Record<string, unknown> = {};
  if (role) {
    updates.role = role as UserRole;
    if (!permissions) {
      updates.permissions = DEFAULT_ROLE_PERMISSIONS[role as UserRole] || [];
    }
  }

  if (Array.isArray(permissions)) {
    updates.permissions = permissions;
  }

  if (typeof isActive === "boolean") {
    updates.isActive = isActive;
  }

  const user = await User.findByIdAndUpdate(params.id, updates, { new: true }).select("fullName email role permissions isActive");
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
