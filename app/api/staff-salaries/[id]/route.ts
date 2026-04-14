import connectToDatabase from "@/lib/mongodb";
import StaffSalary from "@/lib/models/staff-salary.model";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const salary = await StaffSalary.findById(id).lean();

    if (!salary) {
      return NextResponse.json(
        { message: "Staff salary not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(salary, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching staff salary" },
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

    const salary = await StaffSalary.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!salary) {
      return NextResponse.json(
        { message: "Staff salary not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Staff salary updated successfully", data: salary },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update staff salary";
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
    const salary = await StaffSalary.findByIdAndDelete(id);

    if (!salary) {
      return NextResponse.json(
        { message: "Staff salary not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Staff salary deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting staff salary" },
      { status: 500 }
    );
  }
}
