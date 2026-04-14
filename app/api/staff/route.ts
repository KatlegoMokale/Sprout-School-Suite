import connectToDatabase from "@/lib/mongodb";
import Staff from "@/lib/models/staff.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const staff = await Staff.find().sort({ createdAt: -1 }).lean();
    const transformedStaff = staff.map((member) => ({
      ...member,
      $id: member._id.toString(),
    }));
    return NextResponse.json(transformedStaff, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching staff" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const staff = await Staff.create(body);
    return NextResponse.json(
      { message: "Staff created successfully", data: staff },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create staff";
    return NextResponse.json({ message }, { status: 500 });
  }
}
