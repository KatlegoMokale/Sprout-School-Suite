import connectToDatabase from "@/lib/mongodb";
import Event from "@/lib/models/event.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const event = await Event.create(body);
    return NextResponse.json(
      { message: "Event created successfully", data: event },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create event";
    return NextResponse.json({ message }, { status: 500 });
  }
}
