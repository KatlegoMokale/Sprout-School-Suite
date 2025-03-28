import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import PettyCash from "@/lib/models/PettyCash";

// Create PettyCash
async function createPettyCash(data: {
    itemName: string;
    quantity: number;
    price: number;
    store: string;
    category: string;
    date: string;
}) {
    try {
        await connectToDatabase();
        const pettyCash = new PettyCash({
            ...data,
            date: new Date(data.date)
        });
        const response = await pettyCash.save();
        return response;
    } catch (error) {
        console.error("Error creating PettyCash:", error);
        throw new Error("Failed to create PettyCash");
    }
}

async function fetchPettyCash() {
    try {
        await connectToDatabase();
        const pettyCash = await PettyCash.find()
            .sort({ date: -1 })
            .exec();
        return pettyCash;
    } catch (error) {
        console.error("Error fetching PettyCash", error);
        throw new Error("Failed to fetch PettyCash");
    }
}

export async function GET() {
    try {
        const pettyCash = await fetchPettyCash();
        return NextResponse.json(pettyCash, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching PettyCash" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const pettyCash = await createPettyCash(body);
        return NextResponse.json(pettyCash, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating PettyCash" }, { status: 500 });
    }
}