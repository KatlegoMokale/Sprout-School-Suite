import connectToDatabase from "@/lib/mongodb";
import Student from "@/lib/models/student.model";
import { NextResponse } from "next/server";

// ─── GET all students (sorted newest first) ──────────────────────────
export async function GET() {
  try {
    await connectToDatabase();
    const students = await Student.find().sort({ createdAt: -1 }).lean();
    const transformedStudents = students.map(student => ({
      ...student,
      $id: student._id.toString(),
    }));
    return NextResponse.json(transformedStudents, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching students" },
      { status: 500 }
    );
  }
}

// ─── POST create a student ───────────────────────────────────────────
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Map flat p1_ / p2_ fields into embedded guardian sub-documents
    const studentData = {
      firstName: body.firstName,
      secondName: body.secondName,
      surname: body.surname,
      dateOfBirth: body.dateOfBirth,
      age: body.age,
      gender: body.gender,
      address1: body.address1,
      city: body.city,
      province: body.province,
      postalCode: body.postalCode,
      homeLanguage: body.homeLanguage,
      allergies: body.allergies,
      medicalAidNumber: body.medicalAidNumber,
      medicalAidScheme: body.medicalAidScheme,
      studentClass: body.studentClass,
      studentStatus: body.studentStatus ?? "active",
      balance: body.balance ?? 0,
      lastPaid: body.lastPaid,
      guardian1: {
        relationship: body.p1_relationship,
        firstName: body.p1_firstName,
        surname: body.p1_surname,
        email: body.p1_email,
        phoneNumber: body.p1_phoneNumber,
        idNumber: body.p1_idNumber,
        gender: body.p1_gender,
        dateOfBirth: body.p1_dateOfBirth,
        address1: body.p1_address1,
        city: body.p1_city,
        province: body.p1_province,
        postalCode: body.p1_postalCode,
        occupation: body.p1_occupation,
        workNumber: body.p1_workNumber,
      },
      guardian2: body.p2_firstName
        ? {
            relationship: body.p2_relationship,
            firstName: body.p2_firstName,
            surname: body.p2_surname,
            email: body.p2_email,
            phoneNumber: body.p2_phoneNumber,
            idNumber: body.p2_idNumber,
            gender: body.p2_gender,
            dateOfBirth: body.p2_dateOfBirth,
            address1: body.p2_address1,
            city: body.p2_city,
            province: body.p2_province,
            postalCode: body.p2_postalCode,
            occupation: body.p2_occupation,
            workNumber: body.p2_workNumber,
          }
        : undefined,
    };

    const student = await Student.create(studentData);
    return NextResponse.json(
      { message: "Student created successfully", data: student },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create student";
    return NextResponse.json({ message }, { status: 500 });
  }
}
