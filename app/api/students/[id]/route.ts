import connectToDatabase from "@/lib/mongodb";
import Student from "@/lib/models/student.model";
import { NextResponse } from "next/server";

// ─── GET a single student by ID ──────────────────────────────────────
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const student = await Student.findById(id).lean();

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    const transformedStudent = {
      ...student,
      $id: student._id.toString(),
    };

    return NextResponse.json(transformedStudent, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching student" },
      { status: 500 }
    );
  }
}

// ─── PUT update a student ────────────────────────────────────────────
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    // Remove $id from body as it's not part of the schema
    const { $id, ...updateData } = body;

    const student = await Student.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    }).lean();

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student updated successfully", data: student },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update student";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// ─── DELETE a student ────────────────────────────────────────────────
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting student" },
      { status: 500 }
    );
  }
}
