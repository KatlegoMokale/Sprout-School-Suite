import connectToDatabase from "@/lib/mongodb";
import PettyCash from "@/lib/models/petty-cash.model";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const item = await PettyCash.findById(id).lean();

    if (!item) {
      return NextResponse.json(
        { message: "Petty cash item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching petty cash item" },
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

    const item = await PettyCash.findByIdAndUpdate(id, body, {
      returnDocument: 'after',
      runValidators: true,
    }).lean();

    if (!item) {
      return NextResponse.json(
        { message: "Petty cash item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Petty cash item updated successfully", data: item },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update petty cash item";
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
    const item = await PettyCash.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json(
        { message: "Petty cash item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Petty cash item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting petty cash item" },
      { status: 500 }
    );
  }
}
