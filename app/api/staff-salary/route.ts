import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import StaffSalary from "@/lib/models/StaffSalary";

export async function GET() {
  try {
    await connectDB();
    const staffSalaries = await StaffSalary.find({}).sort({ createdAt: -1 });
    return NextResponse.json(staffSalaries);
  } catch (error) {
    console.error("Error fetching staff salaries:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff salaries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const staffSalary = await StaffSalary.create(body);
    return NextResponse.json(staffSalary, { status: 201 });
  } catch (error) {
    console.error("Error creating staff salary:", error);
    return NextResponse.json(
      { error: "Failed to create staff salary" },
      { status: 500 }
    );
  }
}