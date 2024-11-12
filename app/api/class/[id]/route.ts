import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//Fetch Class
async function fetchClass(id:string) {
  try {
    const classes = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "66fcfbc4002c2ec480b0",
      id
    );
    return classes;
  } catch (error) {
    console.error("Error fetching class", error);
    throw new Error("Failed to fetch class");
  }
}

//Delete Class
async function deleteClass(id:string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "66fcfbc4002c2ec480b0",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw new Error("Failed to delete class");
  }
}

//Update Class
async function updateClass(id: string, data: {
  name: string;
  age: string;
  teacherId: string;
  teacherName: string;
}) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "66fcfbc4002c2ec480b0",
      id,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating class:", error);
    throw new Error("Failed to update class");
  }
}

export async function GET(
  req: Request
) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string; // Extract id from URL
    const class1 = await fetchClass(id);
    return NextResponse.json({class1});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch class" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string; // Extract id from URL
    await deleteClass(id);
    return NextResponse.json({message: "Class deleted successfully"});
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json(
      {error: "Failed to delete class"},
      {status: 500}
    );
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string; // Extract id from URL
    const class1 = await req.json();
    await updateClass(id, class1);
    return NextResponse.json({message: "Class updated successfully"});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update class"},
      { status: 500}
    );
  }
}
