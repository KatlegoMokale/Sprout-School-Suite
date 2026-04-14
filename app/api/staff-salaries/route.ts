import connectToDatabase from "@/lib/mongodb";
import StaffSalary from "@/lib/models/staff-salary.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const salaries = await StaffSalary.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(salaries, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching staff salaries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const salary = await StaffSalary.create(body);
    return NextResponse.json(
      { message: "Staff salary created successfully", data: salary },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create staff salary";
    return NextResponse.json({ message }, { status: 500 });
  }
}
