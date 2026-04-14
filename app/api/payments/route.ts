import connectToDatabase from "@/lib/mongodb";
import Payment from "@/lib/models/payment.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const payments = await Payment.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching payments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const payment = await Payment.create(body);
    return NextResponse.json(
      { message: "Payment created successfully", data: payment },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create payment";
    return NextResponse.json({ message }, { status: 500 });
  }
}
