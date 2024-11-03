import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//Fetch Class And Fees

async function fetchClassAndFees(id: string) {
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

//Delete SClass And Fees
async function deleteClassAndFees(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "classAndFees",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting Class And Fees:", error);
    throw new Error("Failed to delete Class And Feess");
  }
}

//Update Class And Fees
async function updateClassAndFees(id: string, data: {
    name: string;
    ageStart: number;
    ageEnd: number;
    ageUnit: string;
    teacherId: string;
    teacherName:string;
    monthlyFee: number;
}){
    try {
        const response = await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "classAndFees",
            id,
            data
        );
        return response;
    } catch (error) {
        console.error("Error updating student:", error);
        throw new Error("Failed to update Class And Fees");
    }
}

export async function GET(
    req: Request, 
    { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await fetchClassAndFees(id);
    return NextResponse.json({data});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ClassAndFees" },
      { status: 500 }
    );
  }
    
}
  

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await deleteClassAndFees(id);
    return NextResponse.json({message: "ClassAndFees deleted successfully"});
  } catch (error) {
    console.error("Error deleting ClassAndFees:", error);
    return NextResponse.json(
      { error: "Failed to delete ClassAndFees" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
      const data = await req.json();
      await updateClassAndFees(id, data);
      return NextResponse.json({message : "ClassAndFees updated successfully"});
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update ClassAndFees" },
        { status: 500 }
      );
    }
  }
  

