import connectToDatabase from "@/lib/mongodb";
import Class from "@/lib/models/class.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const classes = await Class.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching classes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newClass = await Class.create(body);
    return NextResponse.json(
      { message: "Class created successfully", data: newClass },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create class";
    return NextResponse.json({ message }, { status: 500 });
  }
}
