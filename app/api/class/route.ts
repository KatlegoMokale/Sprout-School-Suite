import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client)

//Create stuff

async function createClass(data: {
    name: string;
    age: string;
    teacherId: string;
    teacherName: string
}) {
    try {
        const response = await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "66fcfbc4002c2ec480b0",
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        console.error("Error creating class:", error);
        throw new Error("Failed to create class");
    }
}

async function fetchClass(){
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "66fcfbc4002c2ec480b0", [Query.orderDesc("$createdAt")]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching class", error);
        throw new Error("Failed to fetch class");
    }
}

export async function GET() {
    try {
        const stuff = await fetchClass();
        return NextResponse.json(stuff, {status: 200});
    } catch (error) {
        return NextResponse.json({message:"Error fetching class"}, {status: 500})
    }
}

export async function POST(request: Request) {

    console.log("//////////////////////1")
    try {
        const {name, age, teacherId, teacherName} = await request.json();
        const data = {name, age, teacherId, teacherName}
        const response = await createClass(data);
        return NextResponse.json({message: "Class created successfully"}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: "Failed to create class"}, {status: 500})
    }
}