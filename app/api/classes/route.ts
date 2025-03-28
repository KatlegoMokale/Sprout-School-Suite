import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Class from "@/lib/models/Class";

export async function GET() {
  try {
    await connectDB();
    const classes = await Class.find({}).sort({ createdAt: -1 });
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const classData = await Class.create(body);
    return NextResponse.json(classData, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    );
  }
} 