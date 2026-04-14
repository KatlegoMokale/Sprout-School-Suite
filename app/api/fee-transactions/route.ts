import connectToDatabase from "@/lib/mongodb";
import FeeTransaction from "@/lib/models/fee-transaction.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await FeeTransaction.find()
      .sort({ createdAt: -1 })
      .lean();
    const transformedTransactions = transactions.map(transaction => ({
      ...transaction,
      $id: transaction._id.toString(),
    }));
    return NextResponse.json(transformedTransactions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching fee transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const transaction = await FeeTransaction.create(body);
    return NextResponse.json(
      { message: "Fee transaction created successfully", data: transaction },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create fee transaction";
    return NextResponse.json({ message }, { status: 500 });
  }
}
