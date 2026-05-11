import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import { requireAuth } from "@/lib/auth/guards";

const PROFILE_SELECT = "fullName email role permissions isActive profileImage jobTitle department bio contact dateOfBirth idNumber address1 address2 city province postalCode";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  await connectToDatabase();
  const user = await User.findById(auth.session.sub).select(PROFILE_SELECT);

  if (!user || !user.isActive) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const updates = {
    fullName: body.fullName,
    profileImage: body.profileImage,
    jobTitle: body.jobTitle,
    department: body.department,
    bio: body.bio,
    contact: body.contact,
    dateOfBirth: body.dateOfBirth,
    idNumber: body.idNumber,
    address1: body.address1,
    address2: body.address2,
    city: body.city,
    province: body.province,
    postalCode: body.postalCode,
  } as Record<string, unknown>;

  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined) {
      delete updates[key];
    }
  });

  if (typeof updates.profileImage === "string" && (updates.profileImage as string).length > 2_000_000) {
    return NextResponse.json({ error: "Profile image is too large" }, { status: 400 });
  }

  await connectToDatabase();

  const user = await User.findByIdAndUpdate(auth.session.sub, updates, { new: true }).select(PROFILE_SELECT);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
