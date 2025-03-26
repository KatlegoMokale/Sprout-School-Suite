import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

///Create Student

async function createStudent(data: {
  firstName: string;
  secondName?: string;
  surname: string;
  address1: string;
  dateOfBirth: string;
  gender: string;
  age: string;
  homeLanguage: string;
  allergies?: string;
  medicalAidNumber?: string;
  medicalAidScheme?: string;
  studentClass: string;
  p1_relationship: string;
  p1_firstName: string;
  p1_surname: string;
  p1_address1: string;
  p1_dateOfBirth: string;
  p1_gender: string;
  p1_idNumber: string;
  p1_occupation?: string;
  p1_phoneNumber: string;
  p1_email: string;
  p1_workNumber?: string;
  p2_relationship?: string;
  p2_firstName?: string;
  p2_surname?: string;
  p2_address1?: string;
  p2_dateOfBirth?: string;
  p2_gender?: string;
  p2_idNumber?: string;
  p2_occupation?: string;
  p2_phoneNumber?: string;
  p2_email?: string;
  p2_workNumber?: string;
  balance?: number;
  lastPaid?: string;
  studentStatus?: string;
}) {
  try {
    // Remove any undefined values to prevent Appwrite errors
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "students",
      ID.unique(),
      cleanData
    );
    return response;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
}

/// Fetch Student

async function fetchStudent() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "students",
      [Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching students", error);
    throw new Error("Failed to fetch students");
  }
}

export async function GET() {
  try {
    const students = await fetchStudent();
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching students" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const studentData = await request.json();
    const response = await createStudent(studentData);
    return NextResponse.json(
      { message: "Student created successfully", data: response },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create student" },
      { status: 500 }
    );
  }
}
