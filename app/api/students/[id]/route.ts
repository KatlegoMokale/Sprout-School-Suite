import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//Fetch Student

async function fetchStudent(id: string) {
  try {
    const student = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "students",
      id
    );
    return student;
  } catch (error) {
    console.error("Error fetching student:", error);
    throw new Error("Failed to fetch student");
  }
}

//Delete Student
async function deleteStudent(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "students",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw new Error("Failed to delete student");
  }
}

//Update Student
async function updateStudent(id: string, data: {
  firstName: string;
  secondName: string;
  surname: string;
  address1: string;
  city: string;
  province: string;
  postalCode: string;
  dateOfBirth: string;
  gender: string;
  age: string;
  homeLanguage: string;
  allergies: string;
  medicalAidNumber: string;
  medicalAidScheme: string;
  studentClass: string;
  p1_relationship: string;
  p1_firstName: string;
  p1_surname: string;
  p1_address1: string;
  p1_city: string;
  p1_province: string;
  p1_postalCode: string;
  p1_phoneNumber: string;
  p1_email: string;
  p1_workNumber: string;
  p2_relationship: string;
  p2_firstName: string;
  p2_surname: string;
  p2_address1: string;
  p2_city: string;
  p2_province: string;
  p2_postalCode: string;
  p2_phoneNumber: string;
  p2_email: string;
  p2_workNumber: string;
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
        throw new Error("Failed to update student");
    }
}

export async function GET(
    req: Request, 
    { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const student = await fetchStudent(id);
    return NextResponse.json({student});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
    
}
  

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await deleteStudent(id);
    return NextResponse.json({message: "Student deleted successfully"});
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
      const student = await req.json();
      await updateStudent(id, student);
      return NextResponse.json({message : "Student updated successfully"});
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update student" },
        { status: 500 }
      );
    }
  }
  

