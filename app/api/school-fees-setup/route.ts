import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SchoolFees from "@/lib/models/SchoolFees";

async function createNewSchoolFees(data: {
  year: string;
  registrationFee: string;
  ageStart: string;
  ageEnd: string;
  ageUnit: string;
  monthlyFee: number;
  yearlyFee: number;
  siblingDiscountPrice: number;
}) {
  try {
    await connectToDatabase();
    const schoolFees = await SchoolFees.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return schoolFees;
  } catch (error) {
    console.error("Error creating new school fees:", error);
    throw new Error("Failed to create new school fees");
  }
}

///// Fetch School Fees 
async function fetchSchoolFees() {
  try {
    await connectToDatabase();
    const schoolFees = await SchoolFees.find()
      .sort({ createdAt: -1 });
    return schoolFees;
  } catch (error) {
    console.error("Error fetching all school fees:", error);
    throw new Error("Failed to fetch all school fees");
  }
}

export async function GET() {
  try {
    const schoolFees = await fetchSchoolFees();
    return NextResponse.json(schoolFees);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch school fees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      year,
      registrationFee,
      ageStart,
      ageEnd,
      ageUnit,
      monthlyFee,
      quarterlyFee,
      yearlyFee,
      siblingDiscountPrice,
    } = await request.json();
    const data = {
      year,
      registrationFee,
      ageStart,
      ageEnd,
      ageUnit,
      monthlyFee,
      quarterlyFee,
      yearlyFee,
      siblingDiscountPrice,
    };
    const schoolFees = await createNewSchoolFees(data);
    return NextResponse.json(schoolFees, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create school fees" },
      { status: 500 }
    );
  }
}