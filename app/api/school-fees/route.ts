import connectToDatabase from "@/lib/mongodb";
import SchoolFees from "@/lib/models/school-fees.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const fees = await SchoolFees.find().sort({ createdAt: -1 }).lean();
    const transformedFees = fees.map((fee) => ({
      ...fee,
      $id: fee._id.toString(),
    }));
    return NextResponse.json(transformedFees, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching school fees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const fees = await SchoolFees.create(body);
    return NextResponse.json(
      { message: "School fees created successfully", data: fees },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create school fees";
    return NextResponse.json({ message }, { status: 500 });
  }
}
