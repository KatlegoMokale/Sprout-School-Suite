import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Student from "@/lib/models/Student";

//Fetch Student
async function fetchStudent(id: string) {
  try {
    if (!id) {
      throw new Error("Student ID is required");
    }
    await connectToDatabase();
    const student = await Student.findById(id);
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  } catch (error) {
    console.error("Error fetching student:", error);
    throw new Error("Failed to fetch student");
  }
}

//Delete Student
async function deleteStudent(id: string) {
  try {
    if (!id) {
      throw new Error("Student ID is required");
    }
    await connectToDatabase();
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw new Error("Failed to delete student");
  }
}

//Update Student
async function updateStudent(id: string, data: {
  firstName: string;
  secondName: string;
  surname: string;
  address1: string;
  city: string;
  province: string;
  postalCode: string;
  dateOfBirth: string;
  gender: string;
  age: string;
  homeLanguage: string;
  allergies: string;
  medicalAidNumber: string;
  medicalAidScheme: string;
  studentClass: string;
  p1_relationship: string;
  p1_firstName: string;
  p1_surname: string;
  p1_address1: string;
  p1_city: string;
  p1_province: string;
  p1_postalCode: string;
  p1_phoneNumber: string;
  p1_email: string;
  p1_workNumber: string;
  p2_relationship: string;
  p2_firstName: string;
  p2_surname: string;
  p2_address1: string;
  p2_city: string;
  p2_province: string;
  p2_postalCode: string;
  p2_phoneNumber: string;
  p2_email: string;
  p2_workNumber: string;
}) {
  try {
    if (!id) {
      throw new Error("Student ID is required");
    }
    await connectToDatabase();
    
    const studentData = {
      firstName: data.firstName,
      secondName: data.secondName,
      surname: data.surname,
      address: {
        street: data.address1,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode
      },
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      age: data.age,
      homeLanguage: data.homeLanguage,
      allergies: data.allergies,
      medicalAidNumber: data.medicalAidNumber,
      medicalAidScheme: data.medicalAidScheme,
      studentClass: data.studentClass,
      parent1: {
        relationship: data.p1_relationship,
        firstName: data.p1_firstName,
        surname: data.p1_surname,
        address: {
          street: data.p1_address1,
          city: data.p1_city,
          province: data.p1_province,
          postalCode: data.p1_postalCode
        },
        phoneNumber: data.p1_phoneNumber,
        email: data.p1_email,
        workNumber: data.p1_workNumber
      },
      parent2: data.p2_firstName ? {
        relationship: data.p2_relationship,
        firstName: data.p2_firstName,
        surname: data.p2_surname,
        address: {
          street: data.p2_address1,
          city: data.p2_city,
          province: data.p2_province,
          postalCode: data.p2_postalCode
        },
        phoneNumber: data.p2_phoneNumber,
        email: data.p2_email,
        workNumber: data.p2_workNumber
      } : undefined
    };

    const student = await Student.findByIdAndUpdate(id, studentData, { new: true });
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  } catch (error) {
    console.error("Error updating student:", error);
    throw new Error("Failed to update student");
  }
}

async function updateStudentBalance(id: string, balance: number) {
  try {
    if (!id) {
      throw new Error("Student ID is required");
    }
    await connectToDatabase();
    const student = await Student.findByIdAndUpdate(
      id,
      { 
        $set: { 
          balance,
          lastPaid: new Date()
        }
      },
      { new: true }
    );
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  } catch (error) {
    console.error("Error updating student balance:", error);
    throw new Error("Failed to update student balance");
  }
}

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }
    const { balance } = await req.json();
    const student = await updateStudentBalance(id, balance);
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update student balance" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request
) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }
    const student = await fetchStudent(id);
    return NextResponse.json({ student });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }
    const student = await deleteStudent(id);
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }
    const data = await req.json();
    const student = await updateStudent(id, data);
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}
