import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Transaction from "@/lib/models/Transaction";

//Fetch Transaction
async function fetchTransaction(id: string) {
  try {
    await connectToDatabase();
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return transaction;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw new Error("Failed to fetch transaction");
  }
}

//Delete Transaction
async function deleteTransaction(id: string) {
  try {
    await connectToDatabase();
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return transaction;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw new Error("Failed to delete transaction");
  }
}

//Update Transaction
async function updateTransaction(id: string, data: {
  firstName: string;
  surname: string;
  studentId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}){
  try {
    await connectToDatabase();
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return transaction;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw new Error("Failed to update transaction");
  }
}

export async function GET(
  req: Request
) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Transaction ID is required");
    const transaction = await fetchTransaction(id);
    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Transaction ID is required");
    const transaction = await deleteTransaction(id);
    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Transaction ID is required");
    const data = await req.json();
    const transaction = await updateTransaction(id, data);
    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
