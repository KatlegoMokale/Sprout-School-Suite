import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Class from "@/lib/models/Class";

async function createClassAndFees(data: {
  name: string;
  ageStart: number;
  ageEnd: number;
  ageUnit: string;
  teacherId: string;
  teacherName: string;
  monthlyFee: number;
}) {
  try {
    await connectToDatabase();
    const classData = await Class.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return classData;
  } catch (error) {
    console.error("Error creating new class:", error);
    throw new Error("Failed to create new class");
  }
}

///// Fetch Class And Fees
async function fetchClassAndFees() {
  try {
    await connectToDatabase();
    const classes = await Class.find()
      .sort({ createdAt: -1 });
    return classes;
  } catch (error) {
    console.error("Error fetching all classes:", error);
    throw new Error("Failed to fetch all classes");
  }
}

export async function GET() {
  try {
    const classes = await fetchClassAndFees();
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      name,
      ageStart,
      ageEnd,
      ageUnit,
      teacherId,
      teacherName,
      monthlyFee,
    } = await request.json();
    const data = {
      name,
      ageStart,
      ageEnd,
      ageUnit,
      teacherId,
      teacherName,
      monthlyFee,
    };
    const classData = await createClassAndFees(data);
    return NextResponse.json(classData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    );
  }
}