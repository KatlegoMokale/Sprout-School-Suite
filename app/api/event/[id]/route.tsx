import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/lib/models/Event";

//Fetch Event
async function fetchEvent(id: string) {
  try {
    await connectToDatabase();
    const event = await Event.findById(id);
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Failed to fetch event");
  }
}

//Delete Event
async function deleteEvent(id: string) {
  try {
    await connectToDatabase();
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Failed to delete event");
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
    await connectToDatabase();
    const event = await Event.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Failed to update event");
  }
}

export async function GET(
  req: Request
) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Event ID is required");
    const event = await fetchEvent(id);
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Event ID is required");
    const event = await deleteEvent(id);
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) throw new Error("Event ID is required");
    const data = await req.json();
    const event = await updateEvent(id, data);
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
