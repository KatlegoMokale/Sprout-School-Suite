import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

///Create Student

async function createStudent(data: {
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
  p1_dateOfBirth: string;
  p1_gender: string;
  p1_idNumber: string;
  p1_occupation: string;
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
  p2_dateOfBirth: string;
  p2_gender: string;
  p2_idNumber: string;
  p2_occupation: string;
  p2_phoneNumber: string;
  p2_email: string;
  p2_workNumber: string;
  balance: number;
  lastPaid: string;
  studentStatus: string;
}) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "students",
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating student:", error);
    throw new Error("Failed to create student");
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
    const {
      firstName,
      secondName,
      surname,
      address1,
      city,
      province,
      postalCode,
      dateOfBirth,
      gender,
      age,
      homeLanguage,
      allergies,
      medicalAidNumber,
      medicalAidScheme,
      studentClass,
      p1_relationship,
      p1_firstName,
      p1_surname,
      p1_address1,
      p1_city,
      p1_province,
      p1_postalCode,
      p1_dateOfBirth,
      p1_gender,
      p1_idNumber,
      p1_occupation,
      p1_phoneNumber,
      p1_email,
      p1_workNumber,
      p2_relationship,
      p2_firstName,
      p2_surname,
      p2_address1,
      p2_city,
      p2_province,
      p2_postalCode,
      p2_dateOfBirth,
      p2_gender,
      p2_idNumber,
      p2_occupation,
      p2_phoneNumber,
      p2_email,
      p2_workNumber,
      balance,
      lastPaid,
      studentStatus,
    } = await request.json();
    const data = {
      firstName,
      secondName,
      surname,
      address1,
      city,
      province,
      postalCode,
      dateOfBirth,
      gender,
      age,
      homeLanguage,
      allergies,
      medicalAidNumber,
      medicalAidScheme,
      studentClass,
      p1_relationship,
      p1_firstName,
      p1_surname,
      p1_address1,
      p1_city,
      p1_province,
      p1_postalCode,
      p1_dateOfBirth,
      p1_gender,
      p1_idNumber,
      p1_occupation,
      p1_phoneNumber,
      p1_email,
      p1_workNumber,
      p2_relationship,
      p2_firstName,
      p2_surname,
      p2_address1,
      p2_city,
      p2_province,
      p2_postalCode,
      p2_dateOfBirth,
      p2_gender,
      p2_idNumber,
      p2_occupation,
      p2_phoneNumber,
      p2_email,
      p2_workNumber,
      balance,
      lastPaid,
      studentStatus,
    };
    const response = await createStudent(data);
    return NextResponse.json(
      { message: "Student created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create student" },
      { status: 500 }
    );
  }
}
