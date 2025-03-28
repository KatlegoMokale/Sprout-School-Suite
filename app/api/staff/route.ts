import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Staff from "@/lib/models/Staff";

export async function GET() {
  try {
    await connectDB();
    const staff = await Staff.find({}).sort({ createdAt: -1 });
    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const staff = await Staff.create(body);
    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error("Error creating staff member:", error);
    return NextResponse.json(
      { error: "Failed to create staff member" },
      { status: 500 }
    );
  }
} 