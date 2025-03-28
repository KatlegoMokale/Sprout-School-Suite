import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SchoolFees from "@/lib/models/SchoolFees";

//Fetch School Fees
async function fetchSchoolFees(id: string) {
  try {
    await connectToDatabase();
    const schoolFees = await SchoolFees.findById(id);
    if (!schoolFees) {
      throw new Error("School fees not found");
    }
    return schoolFees;
  } catch (error) {
    console.error("Error fetching school fees:", error);
    throw new Error("Failed to fetch school fees");
  }
}

//Delete School Fees
async function deleteSchoolFees(id: string) {
  try {
    await connectToDatabase();
    const schoolFees = await SchoolFees.findByIdAndDelete(id);
    if (!schoolFees) {
      throw new Error("School fees not found");
    }
    return schoolFees;
  } catch (error) {
    console.error("Error deleting school fees:", error);
    throw new Error("Failed to delete school fees");
  }
}

//Update School Fees
async function updateSchoolFees(id: string, data: {
  year: string;
  registrationFee: string;
  ageStart: string;
  ageEnd: string;
  ageUnit: string;
  monthlyFee: number;
  yearlyFee: number;
  siblingDiscountPrice: number
}){
  try {
    await connectToDatabase();
    const schoolFees = await SchoolFees.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    if (!schoolFees) {
      throw new Error("School fees not found");
    }
    return schoolFees;
  } catch (error) {
    console.error("Error updating school fees:", error);
    throw new Error("Failed to update school fees");
  }
}

export async function GET(
  req: Request
) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("School fees ID is required");
    const schoolFees = await fetchSchoolFees(id);
    return NextResponse.json(schoolFees);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch school fees" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("School fees ID is required");
    const schoolFees = await deleteSchoolFees(id);
    return NextResponse.json(schoolFees);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete school fees" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("School fees ID is required");
    const data = await req.json();
    const schoolFees = await updateSchoolFees(id, data);
    return NextResponse.json(schoolFees);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update school fees" },
      { status: 500 }
    );
  }
}
