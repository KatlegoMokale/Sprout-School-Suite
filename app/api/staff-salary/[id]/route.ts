import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import StaffSalary from "@/lib/models/StaffSalary";

//Fetch Staff Salary
async function fetchStaffSalary(id: string) {
  try {
    await connectToDatabase();
    const staffSalary = await StaffSalary.findById(id);
    if (!staffSalary) {
      throw new Error("Staff salary not found");
    }
    return staffSalary;
  } catch (error) {
    console.error("Error fetching staff salary:", error);
    throw new Error("Failed to fetch staff salary");
  }
}

//Delete Staff Salary
async function deleteStaffSalary(id: string) {
  try {
    await connectToDatabase();
    const staffSalary = await StaffSalary.findByIdAndDelete(id);
    if (!staffSalary) {
      throw new Error("Staff salary not found");
    }
    return staffSalary;
  } catch (error) {
    console.error("Error deleting staff salary:", error);
    throw new Error("Failed to delete staff salary");
  }
}

//Update Staff Salary
async function updateStaffSalary(id: string, data: {
  staffId: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  paymentDate: string;
  staffStatus: string;
}){
  try {
    await connectToDatabase();
    const staffSalary = await StaffSalary.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    if (!staffSalary) {
      throw new Error("Staff salary not found");
    }
    return staffSalary;
  } catch (error) {
    console.error("Error updating staff salary:", error);
    throw new Error("Failed to update staff salary");
  }
}

export async function GET(
  req: Request
) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Staff salary ID is required");
    const staffSalary = await fetchStaffSalary(id);
    return NextResponse.json(staffSalary);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch staff salary" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Staff salary ID is required");
    const staffSalary = await deleteStaffSalary(id);
    return NextResponse.json(staffSalary);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete staff salary" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Staff salary ID is required");
    const data = await req.json();
    const staffSalary = await updateStaffSalary(id, data);
    return NextResponse.json(staffSalary);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update staff salary" },
      { status: 500 }
    );
  }
}
