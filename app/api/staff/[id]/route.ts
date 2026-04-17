import connectToDatabase from "@/lib/mongodb";
import Staff from "@/lib/models/staff.model";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const staff = await Staff.findById(id).lean();

    if (!staff) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ...staff,
        $id: staff._id.toString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching staff" },
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

    const staff = await Staff.findByIdAndUpdate(id, body, {
      returnDocument: 'after',
      runValidators: true,
    }).lean();

    if (!staff) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Staff updated successfully", data: staff },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update staff";
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
    const staff = await Staff.findByIdAndDelete(id);

    if (!staff) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Staff deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting staff" },
      { status: 500 }
    );
  }
}
