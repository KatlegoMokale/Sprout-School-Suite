import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//Fetch Staff Salary

async function fetchStaffSalary(id: string) {
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

//Delete Student
async function deleteStaffSalary(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "staffSalarySchema",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting staff salary:", error);
    throw new Error("Failed to delete staff salary");
  }
}

//Update Student
async function updateStaffSalary(id: string, data: {
    staffId: string;
    baseSalary: number;
    bonuses: number;
    deductions: number;
    paymentDate: string;
    staffStatus : string;
}){
    try {
        const response = await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "students",
            id,
            data
        );
        return response;
    } catch (error) {
        console.error("Error updating student:", error);
        throw new Error("Failed to update staff salary");
    }
}

export async function GET(
    req: Request, 
    { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await fetchStaffSalary(id);
    return NextResponse.json({data});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch staff salary" },
      { status: 500 }
    );
  }
    
}
  

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await deleteStaffSalary(id);
    return NextResponse.json({message: "Staff salary deleted successfully"});
  } catch (error) {
    console.error("Error deleting staff salary:", error);
    return NextResponse.json(
      { error: "Failed to delete staff salary" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
      const data = await req.json();
      await updateStaffSalary(id, data);
      return NextResponse.json({message : "Staff salary updated successfully"});
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update staff salary" },
        { status: 500 }
      );
    }
  }
  

