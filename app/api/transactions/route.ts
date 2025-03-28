import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Transaction from "@/lib/models/Transaction";

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find({}).sort({ createdAt: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const transaction = await Transaction.create(body);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
} 