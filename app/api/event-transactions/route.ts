import connectToDatabase from "@/lib/mongodb";
import EventTransaction from "@/lib/models/event-transaction.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await EventTransaction.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching event transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const transaction = await EventTransaction.create(body);
    return NextResponse.json(
      { message: "Event transaction created successfully", data: transaction },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create event transaction";
    return NextResponse.json({ message }, { status: 500 });
  }
}
