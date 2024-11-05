import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";


const database = new Databases(client)


async function createStudentSchoolFees(data:{
    studentId: string;
    schoolFeesRegId: string;
    startDate: string;
    endDate: string;
    fees: number;
    totalFees: number;
    paidAmount?: number
    balance: number;
    paymentFrequency: string;
    nextPaymentDate: number; }) {
        
        try {
            const response = await database.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
                "studentFeesManagement", 
                ID.unique(), 
                data
            );
            return response;
        } catch (error) {
            console.error("Error creating new  school fees: ", error);
            throw new Error("Failed to create new student school fees")
        }
    
}


///// Fetch School Fees 

async function fetchStudentSchoolFees() {
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "studentFeesManagement",
            [Query.orderDesc("$createdAt")] 
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching all students school fees: ", error);
        throw new Error("Failed to fetch all students school fees")
    }
}


export async function GET() {
    try {
      const data = await fetchStudentSchoolFees();
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Error fetching all students school fees" },
        { status: 500 }
      );
    }
  }

  export async function POST(request: Request) {
    try {
        const {
            studentId,
            schoolFeesRegId,
            startDate,
            endDate,
            fees,
            totalFees,
            paidAmount,
            balance,
            paymentFrequency,
            nextPaymentDate,
        } = await request.json();
        const data = {
            studentId,
            schoolFeesRegId,
            startDate,
            endDate,
            fees,
            totalFees,
            paidAmount,
            balance,
            paymentFrequency,
            nextPaymentDate,
        };
        const response = await createStudentSchoolFees(data);
        return NextResponse.json(
            { message: "Student School Fees Account created successfully"},
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message : "Failed to create student school fees account"},
            { status: 500}
        )
    }
  }