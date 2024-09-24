import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";


const database = new Databases(client)

///Create Transaction

async function createTransaction(data : {Type: string; StudentName: string; StudentSurname: string;
     Amount: number; DatePaid: string;}) {
    
        try {
            const response = await database.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
                "66d8358000313f85aa00", 
                ID.unique(), 
                data
            );
            return response;
        } catch (error) {
            console.error("Error creating transaction:", error);
            throw new Error("Failed to create transaction");
        }
    
    }

/// Fetch Transactions

    async function fetchTransactions( ) {
        
            try {
                const response = await database.listDocuments(
                    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
                    "66d8358000313f85aa00", [Query.orderDesc("$createdAt")]
                );
                return response.documents;
            } catch (error) {
                console.error("Error fetching transactions", error);
                throw new Error("Failed to fetch students");
            }
        
        }

export async function GET() {
   try {
    const transactions = await fetchTransactions();
    return NextResponse.json(transactions, {status: 200});
   } catch (error) {
     return NextResponse.json({message: "Error fetching transactions"}, {status: 500});
   }
    
}

export async function POST(request: Request) {
    try {
        const {
            StudentName,
            StudentSurname,
            Amount,
            DatePaid,
            Type
      } = await request.json();
        const data = {
            StudentName,
            StudentSurname,
            Amount,
            DatePaid,
            Type
        }
        const response = await createTransaction(data);
        return NextResponse.json({message: "Transaction created successfully"}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: "Failed to create transaction"}, {status: 500})
    }
}