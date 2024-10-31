import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";


const database = new Databases(client)


async function createNewSchoolFees(data:{
    year: string;
    registrationFee: string;
    age: string;
    monthlyFee: number;
    yearlyFee: number;
    siblingDiscountPrice: number }) {
        
        try {
            const response = await database.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
                "schoolFees", 
                ID.unique(), 
                data
            );
            return response;
        } catch (error) {
            console.error("Error creating new school fees: ", error);
            throw new Error("Failed to create new school fees")
        }
    
}


///// Fetch School Fees 

async function fetchSchoolFees() {
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "schoolFees",
            [Query.orderDesc("$createdAt")] 
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching all school fees: ", error);
        throw new Error("Failed to fetch all school fees")
    }
}


export async function GET() {
    try {
      const data = await fetchSchoolFees();
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
            year,
            registrationFee,
            age,
            monthlyFee,
            quarterlyFee,
            yearlyFee,
            siblingDiscountPrice,
        } = await request.json();
        const data = {
            year,
            registrationFee,
            age,
            monthlyFee,
            quarterlyFee,
            yearlyFee,
            siblingDiscountPrice,
        };
        const response = await createNewSchoolFees(data);
        return NextResponse.json(
            { message: "School Fees created successfully"},
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message : "Failed to create school fees"},
            { status: 500}
        )
    }
  }