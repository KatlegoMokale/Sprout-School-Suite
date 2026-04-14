import connectToDatabase from "@/lib/mongodb";
import StudentFees from "@/lib/models/student-fees.model";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const fees = await StudentFees.findById(id).lean();

    if (!fees) {
      return NextResponse.json(
        { message: "Student fees not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(fees, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching student fees" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const fees = await StudentFees.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!fees) {
      return NextResponse.json(
        { message: "Student fees not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student fees updated successfully", data: fees },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update student fees";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const fees = await StudentFees.findByIdAndDelete(id);

    if (!fees) {
      return NextResponse.json(
        { message: "Student fees not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student fees deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting student fees" },
      { status: 500 }
    );
  }
}
