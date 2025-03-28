import { connectToDatabase } from "@/lib/mongodb";
import { StudentSchoolFees } from "@/models/studentSchoolFees";
import { NextResponse } from "next/server";

//Fetch Student School Fees
async function fetchStudentSchoolFees(id: string) {
  try {
    await connectToDatabase();
    const data = await StudentSchoolFees.findById(id);
    if (!data) {
      throw new Error("Student School Fees not found");
    }
    return data;
  } catch (error) {
    console.error("Error fetching student school fees:", error);
    throw new Error("Failed to fetch student school fees");
  }
}

//Delete Student School Fees
async function deleteStudentSchoolFees(id: string) {
  try {
    await connectToDatabase();
    const response = await StudentSchoolFees.findByIdAndDelete(id);
    if (!response) {
      throw new Error("Student School Fees not found");
    }
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
    await connectToDatabase();
    const response = await StudentSchoolFees.findByIdAndUpdate(id, data, { new: true });
    if (!response) {
      throw new Error("Student School Fees not found");
    }
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
    return NextResponse.json({message: "Student School Fees updated successfully"});
  } catch (error) {
    console.error("Error updating Student School Fees:", error);
    return NextResponse.json(
      { error: "Failed to update Student School Fees" },
      { status: 500 }
    );
  }
}

//Update Amount Paid
async function updateAmountPaid(id: string, paidAmount: number) {
  try {
    await connectToDatabase();
    const response = await StudentSchoolFees.findByIdAndUpdate(
      id,
      { $set: { paidAmount } },
      { new: true }
    );
    if (!response) {
      throw new Error("Student School Fees not found");
    }
    return response;
  } catch (error) {
    console.error("Error updating amount paid:", error);
    throw new Error("Failed to update amount paid");
  }
}

//Update Registration Balance
async function updateRegBalance(id: string, balance: number) {
  try {
    await connectToDatabase();
    const response = await StudentSchoolFees.findByIdAndUpdate(
      id,
      { $set: { balance } },
      { new: true }
    );
    if (!response) {
      throw new Error("Student School Fees not found");
    }
    return response;
  } catch (error) {
    console.error("Error updating registration balance:", error);
    throw new Error("Failed to update registration balance");
  }
}

export async function PATCH(
  req: Request
) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string; // Extract id from URL
    const { paidAmount, balance } = await req.json();
    
    if (paidAmount !== undefined) {
      await updateAmountPaid(id, paidAmount);
    }
    
    if (balance !== undefined) {
      await updateRegBalance(id, balance);
    }
    
    return NextResponse.json({message: "Student School Fees updated successfully"});
  } catch (error) {
    console.error("Error updating Student School Fees:", error);
    return NextResponse.json(
      { error: "Failed to update Student School Fees" },
      { status: 500 }
    );
  }
}
