import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User, { UserRole } from "@/lib/models/user.model";
import { hashPassword } from "@/lib/auth/password";
import { requirePermission } from "@/lib/auth/guards";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/auth/permissions";

export async function GET(request: NextRequest) {
  const auth = await requirePermission(request, "users:manage");
  if ("error" in auth) return auth.error;

  await connectToDatabase();
  const users = await User.find({}).select("fullName email role permissions isActive createdAt").sort({ createdAt: -1 });
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePermission(request, "users:manage");
    if ("error" in auth) return auth.error;

    const { fullName, email, password, role } = await request.json();

    if (!fullName || !email || !password || !role) {
      return NextResponse.json({ error: "fullName, email, password and role are required" }, { status: 400 });
    }

    await connectToDatabase();

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    const userRole = role as UserRole;
    const [firstNameRaw, ...restNames] = String(fullName).trim().split(/\s+/);
    const firstName = firstNameRaw || "User";
    const surname = restNames.join(" ") || "Account";

    const newUser = await User.create({
      fullName,
      email: String(email).toLowerCase(),
      password: hashPassword(password),
      role: userRole,
      permissions: DEFAULT_ROLE_PERMISSIONS[userRole] || [],
      isActive: true,
      // Backward-compat fields for existing Mongo collection validators.
      firstName,
      secondName: "",
      surname,
      dateOfBirth: "1970-01-01",
      idNumber: "0000000000000",
      address1: "System Address",
      contact: "0000000000",
    });

    return NextResponse.json({
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions,
        isActive: newUser.isActive,
      },
    });
  } catch (error: any) {
    const details = error?.errInfo?.details;
    return NextResponse.json(
      {
        error: "Could not create user due to database validation rules.",
        details,
      },
      { status: 400 }
    );
  }
}
