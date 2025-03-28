import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/lib/models/Student";

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find({}).sort({ createdAt: -1 });
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const student = await Student.create(body);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
} 