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
  req: Request
) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string; // Extract id from URL
    const data = await fetchStudentSchoolFees(id);
    return NextResponse.json({data});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Student School Fees" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string; // Extract id from URL
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

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string; // Extract id from URL
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

async function updateAmountPaid(id: string, paidAmount: number) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "studentFeesManagement", // Update to correct collection name
      id,
      { paidAmount }
    );
    return response;
  } catch (error) {
    console.error("Error updating student amount paid:", error);
    throw new Error("Failed to update student amount paid");
  }
}

async function updateRegBalance(id: string, balance: number) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "studentFeesManagement",
      id,
      { balance: balance } // Pass as an object with the field name
    );
    return response;
  } catch (error) {
    console.error("Error updating student amount paid:", error);
    throw new Error("Failed to update student amount paid");
  }
}

export async function PATCH(
  req: Request
) {
  try {
    // Ensure we have the ID
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string; // Extract id from URL

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { balance, paidAmount } = body;
    console.log('Received PATCH request:', { id, balance, paidAmount });

    let response;
    try {
      if (balance !== undefined) {
        console.log('Updating balance:', balance);
        response = await updateRegBalance(id, balance);
      } else if (paidAmount !== undefined) {
        console.log('Updating paid amount:', paidAmount);
        response = await updateAmountPaid(id, paidAmount);
      } else {
        return NextResponse.json(
          { error: "Either balance or paidAmount must be provided" },
          { status: 400 }
        );
      }
    } catch (updateError: any) {
      // Handle Appwrite specific errors
      if (updateError.code === 404) {
        return NextResponse.json(
          { error: "Student fee record not found" },
          { status: 404 }
        );
      }
      throw updateError;
    }

    return NextResponse.json({
      message: "Student payment details updated successfully",
      data: response
    });
  } catch (error: any) {
    console.error('Error in PATCH /api/student-school-fees/[id]:', error);
    // Return appropriate status codes based on the error
    const statusCode = error.code === 404 ? 404 : 500;
    return NextResponse.json(
      {
        error: error.message || "Failed to update student payment details",
        details: error.response || null
      },
      { status: statusCode }
    );
  }
}
