import connectToDatabase from "@/lib/mongodb";
import Parent from "@/lib/models/parent.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const parents = await Parent.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(parents, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching parents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parent = await Parent.create(body);
    return NextResponse.json(
      { message: "Parent created successfully", data: parent },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create parent";
    return NextResponse.json({ message }, { status: 500 });
  }
}
