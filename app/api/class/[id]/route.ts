import connectToDatabase from "@/lib/mongodb";
import Class from "@/lib/models/class.model";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const classDoc = await Class.findById(id).lean();

    if (!classDoc) {
      return NextResponse.json(
        { message: "Class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(classDoc, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching class" },
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

    const classDoc = await Class.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!classDoc) {
      return NextResponse.json(
        { message: "Class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Class updated successfully", data: classDoc },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update class";
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
    const classDoc = await Class.findByIdAndDelete(id);

    if (!classDoc) {
      return NextResponse.json(
        { message: "Class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Class deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting class" },
      { status: 500 }
    );
  }
}
