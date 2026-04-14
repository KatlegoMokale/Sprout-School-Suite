import connectToDatabase from "@/lib/mongodb";
import FeeTransaction from "@/lib/models/fee-transaction.model";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const transaction = await FeeTransaction.findById(id).lean();

    if (!transaction) {
      return NextResponse.json(
        { message: "Fee transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching fee transaction" },
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

    const transaction = await FeeTransaction.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!transaction) {
      return NextResponse.json(
        { message: "Fee transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Fee transaction updated successfully", data: transaction },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update fee transaction";
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
    const transaction = await FeeTransaction.findByIdAndDelete(id);

    if (!transaction) {
      return NextResponse.json(
        { message: "Fee transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Fee transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting fee transaction" },
      { status: 500 }
    );
  }
}
