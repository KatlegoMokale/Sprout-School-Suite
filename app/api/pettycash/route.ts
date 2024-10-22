import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client)

//Create PettyCash

async function createPettyCash(data: {
    itemName: string;
    quantity: number;
    price: number;
    store: string;
    catergory: string;
    date: string;
}) {
    try {
        const response = await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "pettyCash",
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        console.error("Error creating PettyCash:", error);
        throw new Error("Failed to create PettyCash");
    }
}

async function fetchPettyCash(){
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "pettyCash", [Query.orderDesc("$createdAt")]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching PettyCash", error);
        throw new Error("Failed to fetch PettyCash");
    }
}

export async function GET() {
    try {
        const grocery = await fetchPettyCash();
        return NextResponse.json(grocery, {status: 200});
    } catch (error) {
        return NextResponse.json({message:"Error fetching PettyCash"}, {status: 500})
    }
}

export async function POST(request: Request) {
    try {
        const {itemName, quantity, price, store, catergory, date} = await request.json();
        const data = {itemName, quantity, price, store, catergory, date}
        const response = await createPettyCash(data);
        return NextResponse.json({message: "POST PettyCash created successfully--"}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: "POST: Failed to create PettyCash--"}, {status: 500})
    }
}