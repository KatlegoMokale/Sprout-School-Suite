import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//Fetch Event
async function fetchEvent(id: string) {
  try {
    const data = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Event",
      id
    );
    return data;
  } catch (error) {
    console.error("Error fetching Event:", error);
    throw new Error("Failed to fetch Event");
  }
}

//Delete Event
async function deleteEvent(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Event",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting Event:", error);
    throw new Error("Failed to delete Event");
  }
}

//Update Event
async function updateEvent(id: string, data: {
    eventName: string;
    date: string;
    amount: number;
    description: string; 
}){
    try {
        const response = await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "schoolFees",
            id,
            data
        );
        return response;
    } catch (error) {
        console.error("Error updating Event:", error);
        throw new Error("Failed to update Event");
    }
}

export async function GET(
    req: Request, 
    { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await fetchEvent(id);
    return NextResponse.json({data});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Event" },
      { status: 500 }
    );
  }
    
}
  

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await deleteEvent(id);
    return NextResponse.json({message: "Event Fees deleted successfully"});
  } catch (error) {
    console.error("Error deleting Event Fees:", error);
    return NextResponse.json(
      { error: "Failed to delete Event Fees" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
      const data = await req.json();
      await updateEvent(id, data);
      return NextResponse.json({message : "Event updated successfully"});
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update Event" },
        { status: 500 }
      );
    }
  }
  

