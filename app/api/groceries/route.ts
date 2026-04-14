import connectToDatabase from "@/lib/mongodb";
import Grocery from "@/lib/models/grocery.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const groceries = await Grocery.find().sort({ createdAt: -1 }).lean();
    const transformedGroceries = groceries.map((grocery) => ({
      ...grocery,
      $id: grocery._id.toString(),
    }));
    return NextResponse.json(transformedGroceries, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching groceries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const grocery = await Grocery.create(body);
    return NextResponse.json(
      { message: "Grocery created successfully", data: grocery },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create grocery";
    return NextResponse.json({ message }, { status: 500 });
  }
}
