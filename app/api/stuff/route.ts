import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client)

//Create stuff

async function createStuff(data: {
    firstName: string;
    secondName: string;
    dateOfBirth: string;
    idNumber: string;
    position: string;
    contact: string;
    address1: string;
}) {
    try {
        const response = await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "66fcfb0e001b2b36c05c",
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        console.error("Error creating stuff:", error);
        throw new Error("Failed to create stuff");
    }
}

async function fetchStuff(){
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "66fcfb0e001b2b36c05c", [Query.orderDesc("$createdAt")]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching stuff", error);
        throw new Error("Failed to fetch Stuff");
    }
}

export async function GET() {
    try {
        const stuff = await fetchStuff();
        return NextResponse.json(stuff, {status: 200});
    } catch (error) {
        return NextResponse.json({message:"Error fetching stuff"}, {status: 500})
    }
}

export async function POST(request: Request) {
    try {
        const {firstName, secondName, surname, dateOfBirth, idNumber, position, contact, address1} = await request.json();
        const data = {firstName, secondName, surname, dateOfBirth, idNumber, position, contact, address1}
        const response = await createStuff(data);
        return NextResponse.json({message: "Stuff created successfully"}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: "Failed to create stuff"}, {status: 500})
    }
}