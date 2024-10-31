import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";


const database = new Databases(client)


async function createNewStaffSalary(data:{
    staffId: string,
baseSalary: number,
bonuses: number,
deductions: number,
paymentDate: string,
staffStatus : string,}) {
        
        try {
            const response = await database.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
                "staffSalarySchema", 
                ID.unique(), 
                data
            );
            return response;
        } catch (error) {
            console.error("Error creating new Staff Salary: ", error);
            throw new Error("Failed to create new Staff Salary")
        }
    
}


///// Fetch School Fees 

async function fetchStaffSalary() {
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "staffSalarySchema",
            [Query.orderDesc("$createdAt")] 
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching all Staff Salaries: ", error);
        throw new Error("Failed to fetch all Staff Salaries ")
    }
}


export async function GET() {
    try {
      const data = await fetchStaffSalary();
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Error fetching all Staff Salaries" },
        { status: 500 }
      );
    }
  }

  export async function POST(request: Request) {
    try {
        const {
            staffId,
baseSalary,
bonuses,
deductions,
paymentDate,
staffStatus,
        } = await request.json();
        const data = {
            staffId,
            baseSalary,
            bonuses,
            deductions,
            paymentDate,
            staffStatus,
        };
        const response = await createNewStaffSalary(data);
        return NextResponse.json(
            { message: "Staff Salary created successfully"},
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message : "Failed to create Staff Salary "},
            { status: 500}
        )
    }
  }