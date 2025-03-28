import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Grocery from "@/lib/models/Grocery";

// Create grocery
async function createGrocery(data: {
    summary: string;
    totalPaid: number;
    store: string;
    date: string;
}) {
    try {
        await connectToDatabase();
        const grocery = new Grocery({
            ...data,
            date: new Date(data.date)
        });
        const response = await grocery.save();
        return response;
    } catch (error) {
        console.error("Error creating Grocery:", error);
        throw new Error("Failed to create Grocery");
    }
}

async function fetchGrocery() {
    try {
        await connectToDatabase();
        const grocery = await Grocery.find()
            .sort({ date: -1 })
            .exec();
        return grocery;
    } catch (error) {
        console.error("Error fetching Grocery", error);
        throw new Error("Failed to fetch Grocery");
    }
}

export async function GET() {
    try {
        const grocery = await fetchGrocery();
        return NextResponse.json(grocery, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching Grocery" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const grocery = await createGrocery(body);
        return NextResponse.json(grocery, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating Grocery" }, { status: 500 });
    }
}