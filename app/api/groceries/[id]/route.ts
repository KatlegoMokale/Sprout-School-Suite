import connectToDatabase from "@/lib/mongodb";
import Grocery from "@/lib/models/grocery.model";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const grocery = await Grocery.findById(id).lean();

    if (!grocery) {
      return NextResponse.json(
        { message: "Grocery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(grocery, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching grocery" },
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

    const grocery = await Grocery.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!grocery) {
      return NextResponse.json(
        { message: "Grocery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Grocery updated successfully", data: grocery },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update grocery";
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
    const grocery = await Grocery.findByIdAndDelete(id);

    if (!grocery) {
      return NextResponse.json(
        { message: "Grocery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Grocery deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting grocery" },
      { status: 500 }
    );
  }
}
