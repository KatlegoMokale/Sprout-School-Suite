import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client)

//Create Event Transaction

async function createEventTransaction(data: {
    eventId: string;
    childId: string;
    amount: number;
    quantity: number;
    datePaid: string;
}) {
    try {
        const response = await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "EventTransaction",
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        console.error("Error creating event transaction:", error);
        throw new Error("Failed to create event transaction");
    }
}

async function fetchEventTransaction(){
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "EventTransaction", [Query.orderDesc("$createdAt")]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching event transaction", error);
        throw new Error("Failed to fetch event transaction");
    }
}

export async function GET() {
    try {
        const event = await fetchEventTransaction();
        return NextResponse.json(event, {status: 200});
    } catch (error) {
        return NextResponse.json({message:"Error fetching event transaction"}, {status: 500})
    }
}

export async function POST(request: Request) {
    try {
        const {eventId, childId, amount, quantity, datePaid} = await request.json();
        const data = {eventId, childId, amount, quantity, datePaid};
        const response = await createEventTransaction(data);
        return NextResponse.json({message: "POST Event transaction created successfully--"}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: "POST: Failed to create event transaction--"}, {status: 500})
    }
}