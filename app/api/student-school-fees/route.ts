import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Fee from "@/lib/models/Fee";

export async function GET() {
  try {
    await connectDB();
    const studentFees = await Fee.find({}).sort({ createdAt: -1 });
    return NextResponse.json(studentFees);
  } catch (error) {
    console.error("Error fetching student fees:", error);
    return NextResponse.json(
      { error: "Failed to fetch student fees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const studentFee = await Fee.create(body);
    return NextResponse.json(studentFee, { status: 201 });
  } catch (error) {
    console.error("Error creating student fee:", error);
    return NextResponse.json(
      { error: "Failed to create student fee" },
      { status: 500 }
    );
  }
}