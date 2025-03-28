import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/lib/models/Event";

// Create event
async function createEvent(data: {
    eventName: string;
    date: string;
    amount: number;
    description: string;
    type: string;
    status?: string;
    participants?: string[];
}) {
    try {
        await connectToDatabase();
        const event = new Event({
            ...data,
            date: new Date(data.date),
            status: data.status || 'Upcoming'
        });
        const response = await event.save();
        return response;
    } catch (error) {
        console.error("Error creating Event:", error);
        throw new Error("Failed to create Event");
    }
}

async function fetchEvents() {
    try {
        await connectToDatabase();
        const events = await Event.find()
            .sort({ date: -1 })
            .populate('participants', 'firstName surname')
            .exec();
        return events;
    } catch (error) {
        console.error("Error fetching Events", error);
        throw new Error("Failed to fetch Events");
    }
}

export async function GET() {
    try {
        const events = await fetchEvents();
        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching Events" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const event = await createEvent(body);
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating Event" }, { status: 500 });
    }
}