import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client)

//Create event

async function createEvent(data: {
    name: string;
    date: string;
    price: number;
}) {
    try {
        const response = await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "Event",
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        console.error("Error creating event:", error);
        throw new Error("Failed to create event");
    }
}

async function fetchEvent(){
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "Event", [Query.orderDesc("$createdAt")]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching event", error);
        throw new Error("Failed to fetch event");
    }
}

export async function GET() {
    try {
        const event = await fetchEvent();
        return NextResponse.json(event, {status: 200});
    } catch (error) {
        return NextResponse.json({message:"Error fetching event"}, {status: 500})
    }
}

export async function POST(request: Request) {
    try {
        const {name, date, price} = await request.json();
        const data = {name, date, price}
        const response = await createEvent(data);
        return NextResponse.json({message: "POST Event created successfully--"}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: "POST: Failed to create event--"}, {status: 500})
    }
}