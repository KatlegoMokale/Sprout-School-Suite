import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//Fetch Student School Fees
async function fetchStudentSchoolFees(id: string) {
  try {
    const data = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "staffSalarySchema",
      id
    );
    return data;
  } catch (error) {
    console.error("Error fetching staff salary:", error);
    throw new Error("Failed to fetch staff salary");
  }
}

//Delete Student School Fees
async function deleteStudentSchoolFees(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "schoolFees",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting Student School Fees:", error);
    throw new Error("Failed to delete Student School Fees");
  }
}

//Update Student School Fees
async function updateStudentSchoolFees(id: string, data: {
    schoolfeesSchemaId: string;
    studentId: string;
    year: Number;
    age: string;
    startDate: string;
    endDate: string;
    registrationFee: number;
    fees: number;
    totalFees: number;
    paidAmount: number
    balance: number;
    paymentFrequency: string;
    nextPaymentDate: string; 
}){
    try {
        const response = await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "schoolFees",
            id,
            data
        );
        return response;
    } catch (error) {
        console.error("Error updating Student School Fees:", error);
        throw new Error("Failed to update Student School Fees");
    }
}

export async function GET(
    req: Request, 
    { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await fetchStudentSchoolFees(id);
    return NextResponse.json({data});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Student School Fees" },
      { status: 500 }
    );
  }
    
}
  

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await deleteStudentSchoolFees(id);
    return NextResponse.json({message: "Student School Fees deleted successfully"});
  } catch (error) {
    console.error("Error deleting Student School Fees:", error);
    return NextResponse.json(
      { error: "Failed to delete Student School Fees" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
      const data = await req.json();
      await updateStudentSchoolFees(id, data);
      return NextResponse.json({message : "Student School Fees updated successfully"});
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update Student School Fees" },
        { status: 500 }
      );
    }
  }
  

