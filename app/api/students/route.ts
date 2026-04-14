import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import Class from "@/lib/models/class.model";
import SchoolFees from "@/lib/models/school-fees.model";
import StudentFees from "@/lib/models/student-fees.model";
import Student from "@/lib/models/student.model";
import { NextResponse } from "next/server";

const getAgeInMonths = (dateOfBirth: string) => {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;

  const now = new Date();
  let months =
    (now.getFullYear() - dob.getFullYear()) * 12 +
    (now.getMonth() - dob.getMonth());

  if (now.getDate() < dob.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
};

const toMonthsRange = (start: number, end: number, unit: "months" | "years") => {
  if (unit === "months") {
    return { min: start, max: end };
  }

  // Convert years to an inclusive month range.
  return { min: start * 12, max: end * 12 + 11 };
};

// ─── GET all students (sorted newest first) ──────────────────────────
export async function GET() {
  try {
    await connectToDatabase();
    const students = await Student.find().sort({ createdAt: -1 }).lean();
    const transformedStudents = students.map((student) => ({
      ...student,
      $id: student._id.toString(),
    }));
    return NextResponse.json(transformedStudents, { status: 200 });
  } catch (_error) {
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
    const autoFeeRegistration = body.autoFeeRegistration !== false;
    const currentYear = new Date().getFullYear();

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
      linkedStudentIds: body.linkedStudentIds ?? [],
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

    let autoRegistration: {
      enabled: boolean;
      created: boolean;
      message: string;
      studentFeesId?: string;
    } = {
      enabled: autoFeeRegistration,
      created: false,
      message: "Auto fee registration skipped.",
    };

    if (autoFeeRegistration) {
      const ageInMonths = getAgeInMonths(body.dateOfBirth);
      const canLookupClass =
        typeof body.studentClass === "string" &&
        mongoose.Types.ObjectId.isValid(body.studentClass);
      const classRecord =
        canLookupClass && body.studentClass
          ? await Class.findById(body.studentClass).lean()
          : null;

      const yearPlans = await SchoolFees.find({ year: currentYear }).lean();

      let selectedPlan =
        ageInMonths === null
          ? null
          :
              yearPlans
                .filter((plan) => {
                  const { min, max } = toMonthsRange(
                    plan.ageStart,
                    plan.ageEnd,
                    plan.ageUnit
                  );
                  return ageInMonths >= min && ageInMonths <= max;
                })
                .sort((a, b) => {
                  const aSpan = a.ageEnd - a.ageStart;
                  const bSpan = b.ageEnd - b.ageStart;
                  return aSpan - bSpan;
                })[0] ?? null;

      if (!selectedPlan && classRecord) {
        selectedPlan =
          yearPlans.find(
            (plan) =>
              plan.ageStart === classRecord.ageStart &&
              plan.ageEnd === classRecord.ageEnd &&
              plan.ageUnit === classRecord.ageUnit
          ) ?? null;
      }

      if (selectedPlan) {
        const now = new Date();
        const monthsRemaining = 12 - now.getMonth();
        const totalFees =
          selectedPlan.registrationFee + selectedPlan.monthlyFee * monthsRemaining;

        const startDate = now.toISOString().split("T")[0];
        const endDate = `${currentYear}-12-31`;

        const createdFees = await StudentFees.create({
          studentId: student._id.toString(),
          schoolFeesRegId: selectedPlan._id.toString(),
          startDate,
          endDate,
          fees: selectedPlan.monthlyFee,
          totalFees,
          paidAmount: 0,
          balance: totalFees,
          paymentFrequency: "monthly",
          paymentDate: 1,
        });

        await Student.findByIdAndUpdate(student._id, { balance: totalFees });

        autoRegistration = {
          enabled: true,
          created: true,
          message: "Student auto-registered to current year fee plan.",
          studentFeesId: createdFees._id.toString(),
        };
      } else {
        autoRegistration = {
          enabled: true,
          created: false,
          message:
            "No matching current-year fee plan found. Student created without fee enrollment.",
        };
      }
    }

    return NextResponse.json(
      {
        message: "Student created successfully",
        data: student,
        autoRegistration,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create student";
    return NextResponse.json({ message }, { status: 500 });
  }
}
