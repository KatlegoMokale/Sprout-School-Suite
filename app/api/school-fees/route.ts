import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SchoolFees from "@/lib/models/SchoolFees";

export async function GET() {
  try {
    await connectDB();
    const schoolFees = await SchoolFees.find({}).sort({ createdAt: -1 });
    return NextResponse.json(schoolFees);
  } catch (error) {
    console.error("Error fetching school fees:", error);
    return NextResponse.json(
      { error: "Failed to fetch school fees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const schoolFee = await SchoolFees.create(body);
    return NextResponse.json(schoolFee, { status: 201 });
  } catch (error) {
    console.error("Error creating school fee:", error);
    return NextResponse.json(
      { error: "Failed to create school fee" },
      { status: 500 }
    );
  }
} 