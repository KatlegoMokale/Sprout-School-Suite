import connectToDatabase from "@/lib/mongodb";
import Student from "@/lib/models/student.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const studentId = String(body?.studentId || "").trim();
    const siblingIds = Array.isArray(body?.siblingIds)
      ? body.siblingIds.map((id: unknown) => String(id).trim()).filter(Boolean)
      : [];

    if (!studentId) {
      return NextResponse.json(
        { message: "studentId is required" },
        { status: 400 }
      );
    }

    if (siblingIds.length === 0) {
      await Student.findByIdAndUpdate(studentId, { linkedStudentIds: [] });
      return NextResponse.json(
        { message: "Sibling links cleared successfully" },
        { status: 200 }
      );
    }

    const group = Array.from(new Set([studentId, ...siblingIds]));

    const existingStudents = await Student.find({ _id: { $in: group } })
      .select("_id")
      .lean();
    const existingIds = new Set(existingStudents.map((student) => student._id.toString()));

    if (!existingIds.has(studentId)) {
      return NextResponse.json(
        { message: "Primary student not found" },
        { status: 404 }
      );
    }

    const finalGroup = group.filter((id) => existingIds.has(id));

    await Promise.all(
      finalGroup.map((id) =>
        Student.findByIdAndUpdate(id, {
          linkedStudentIds: finalGroup.filter((memberId) => memberId !== id),
        })
      )
    );

    return NextResponse.json(
      {
        message: "Sibling links updated successfully",
        data: {
          studentId,
          siblingIds: finalGroup.filter((id) => id !== studentId),
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update sibling links";
    return NextResponse.json({ message }, { status: 500 });
  }
}
