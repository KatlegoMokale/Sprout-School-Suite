import connectToDatabase from "@/lib/mongodb";
import EventTransaction from "@/lib/models/event-transaction.model";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const transaction = await EventTransaction.findById(id).lean();

    if (!transaction) {
      return NextResponse.json(
        { message: "Event transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching event transaction" },
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

    const transaction = await EventTransaction.findByIdAndUpdate(id, body, {
      returnDocument: 'after',
      runValidators: true,
    }).lean();

    if (!transaction) {
      return NextResponse.json(
        { message: "Event transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event transaction updated successfully", data: transaction },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update event transaction";
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
    const transaction = await EventTransaction.findByIdAndDelete(id);

    if (!transaction) {
      return NextResponse.json(
        { message: "Event transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting event transaction" },
      { status: 500 }
    );
  }
}
