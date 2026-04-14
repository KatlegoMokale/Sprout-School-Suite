import connectToDatabase from "@/lib/mongodb";
import SchoolFees from "@/lib/models/school-fees.model";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const fees = await SchoolFees.findById(id).lean();

    if (!fees) {
      return NextResponse.json(
        { message: "School fees not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(fees, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching school fees" },
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

    const fees = await SchoolFees.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!fees) {
      return NextResponse.json(
        { message: "School fees not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "School fees updated successfully", data: fees },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update school fees";
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
    const fees = await SchoolFees.findByIdAndDelete(id);

    if (!fees) {
      return NextResponse.json(
        { message: "School fees not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "School fees deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting school fees" },
      { status: 500 }
    );
  }
}
