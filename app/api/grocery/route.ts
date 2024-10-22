import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client)

//Create grocery

async function createGrocery(data: {
    summery: string;
    totalPaid:  number;
    store: string;
    date: string;
}) {
    try {
        const response = await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "Grocery",
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        console.error("Error creating Grocery:", error);
        throw new Error("Failed to create Grocery");
    }
}

async function fetchGrocery(){
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "Grocery", [Query.orderDesc("$createdAt")]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching Grocery", error);
        throw new Error("Failed to fetch Grocery");
    }
}

export async function GET() {
    try {
        const grocery = await fetchGrocery();
        return NextResponse.json(grocery, {status: 200});
    } catch (error) {
        return NextResponse.json({message:"Error fetching Grocery"}, {status: 500})
    }
}

export async function POST(request: Request) {
    try {
        const {summery, totalPaid, store, date } = await request.json();
        const data = {summery, totalPaid, store, date}
        const response = await createGrocery(data);
        return NextResponse.json({message: "POST grocery created successfully--"}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: "POST: Failed to create grocery--"}, {status: 500})
    }
}