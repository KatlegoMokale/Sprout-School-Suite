import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//Fetch Student

async function fetchStuff(id: string) {
  try {
    const class1 = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "66fcfb0e001b2b36c05c",
      id
    );
    return class1;
  } catch (error) {
    console.error("Error fetching class:", error);
    throw new Error("Failed to fetch class");
  }
}

//Delete Student
async function deleteStuff(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "66fcfb0e001b2b36c05c",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw new Error("Failed to delete class");
  }
}

//Update Student
async function updateStuff(id: string, data: {
  firstName: string;
  secondName: string;
  surname: string;
  dateOfBirth: string;
  idNumber: string;
  contact: string;
  address1: string
}){
    try {
        const response = await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "66fcfb0e001b2b36c05c",
            id,
            data
        );
        return response;
    } catch (error) {
        console.error("Error updating stuff:", error);
        throw new Error("Failed to update stuff");
    }
}

export async function GET(
    req: Request, 
    { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const stuff = await fetchStuff(id);
    return NextResponse.json({stuff});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stuff" },
      { status: 500 }
    );
  }
    
}
  

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await deleteStuff(id);
    return NextResponse.json({message: "Stuff deleted successfully"});
  } catch (error) {
    console.error("Error deleting stuff:", error);
    return NextResponse.json(
      { error: "Failed to delete stuff" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
      const stuff = await req.json();
      await updateStuff(id, stuff);
      return NextResponse.json({message : "Stuff updated successfully"});
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update student" },
        { status: 500 }
      );
    }
  }
  

