import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";


const database = new Databases(client)


async function createClassAndFees(data:{
    name: string;
    ageStart: number;
    ageEnd: number;
    ageUnit: string;
    teacherId: string;
    teacherName:string;
    monthlyFee: number;}) {
        
        try {
            const response = await database.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
                "classAndFees", 
                ID.unique(), 
                data
            );
            return response;
        } catch (error) {
            console.error("Error creating new Class And Fees: ", error);
            throw new Error("Failed to create new Class And Fees")
        }
    
}

///// Fetch Class And Fees

async function fetchClassAndFees() {
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "classAndFees",
            [Query.orderDesc("$createdAt")] 
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching all Class And Fees: ", error);
        throw new Error("Failed to fetch all Class And Fees")
    }
}


export async function GET() {
    try {
      const data = await fetchClassAndFees();
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Error fetching all students Class And Fees" },
        { status: 500 }
      );
    }
  }

  export async function POST(request: Request) {
    try {
        const {
            name,
            ageStart,
            ageEnd,
            ageUnit,
            teacherId,
            teacherName,
            monthlyFee,
        } = await request.json();
        const data = {
            name,
            ageStart,
            ageEnd,
            ageUnit,
            teacherId,
            teacherName,
            monthlyFee,
        };
        const response = await createClassAndFees(data);
        return NextResponse.json(
            { message: "Class And Fees created successfully"},
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message : "Failed to create Class And Fees"},
            { status: 500}
        )
    }
  }