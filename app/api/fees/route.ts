import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Fee from "@/lib/models/Fee";

export async function GET() {
  try {
    await connectDB();
    const fees = await Fee.find({}).sort({ createdAt: -1 });
    return NextResponse.json(fees);
  } catch (error) {
    console.error("Error fetching fees:", error);
    return NextResponse.json(
      { error: "Failed to fetch fees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const fee = await Fee.create(body);
    return NextResponse.json(fee, { status: 201 });
  } catch (error) {
    console.error("Error creating fee:", error);
    return NextResponse.json(
      { error: "Failed to create fee" },
      { status: 500 }
    );
  }
} 