import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Class from "@/lib/models/Class";

//Fetch Class
async function fetchClass(id: string) {
  try {
    await connectToDatabase();
    const classData = await Class.findById(id);
    if (!classData) {
      throw new Error("Class not found");
    }
    return classData;
  } catch (error) {
    console.error("Error fetching class:", error);
    throw new Error("Failed to fetch class");
  }
}

//Delete Class
async function deleteClass(id: string) {
  try {
    await connectToDatabase();
    const classData = await Class.findByIdAndDelete(id);
    if (!classData) {
      throw new Error("Class not found");
    }
    return classData;
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
    await connectToDatabase();
    const classData = await Class.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    if (!classData) {
      throw new Error("Class not found");
    }
    return classData;
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
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Class ID is required");
    const classData = await fetchClass(id);
    return NextResponse.json(classData);
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
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Class ID is required");
    const classData = await deleteClass(id);
    return NextResponse.json(classData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Class ID is required");
    const data = await req.json();
    const classData = await updateClass(id, data);
    return NextResponse.json(classData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update class" },
      { status: 500 }
    );
  }
}
