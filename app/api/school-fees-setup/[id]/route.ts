import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//Fetch School Fees

async function fetchSchoolFees(id: string) {
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

//Delete School Fees
async function deleteSchoolFees(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "schoolFees",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting school fees:", error);
    throw new Error("Failed to delete school fees");
  }
}

//Update School Fees
async function updateSchoolFees(id: string, data: {
    year: string;
    registrationFee: string;
    age: string;
    monthlyFee: number;
    yearlyFee: number;
    siblingDiscountPrice: number 
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
        console.error("Error updating student:", error);
        throw new Error("Failed to update school fees");
    }
}

export async function GET(
    req: Request, 
    { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await fetchSchoolFees(id);
    return NextResponse.json({data});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch school fees" },
      { status: 500 }
    );
  }
    
}
  

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await deleteSchoolFees(id);
    return NextResponse.json({message: "School fees deleted successfully"});
  } catch (error) {
    console.error("Error deleting school fees:", error);
    return NextResponse.json(
      { error: "Failed to delete school fees" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
      const data = await req.json();
      await updateSchoolFees(id, data);
      return NextResponse.json({message : "School fees updated successfully"});
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update school fees" },
        { status: 500 }
      );
    }
  }
  

