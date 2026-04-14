import connectToDatabase from "@/lib/mongodb";
import PettyCash from "@/lib/models/petty-cash.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await PettyCash.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching petty cash items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const item = await PettyCash.create(body);
    return NextResponse.json(
      { message: "Petty cash item created successfully", data: item },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create petty cash item";
    return NextResponse.json({ message }, { status: 500 });
  }
}
