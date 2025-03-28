import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Transaction from "@/lib/models/Transaction";

//Create Event Transaction
async function createEventTransaction(data: {
    eventId: string;
    childId: string;
    amount: number;
    quantity: number;
    datePaid: string;
}) {
    try {
        await connectToDatabase();
        const transaction = await Transaction.create({
            ...data,
            type: 'event',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return transaction;
    } catch (error) {
        console.error("Error creating event transaction:", error);
        throw new Error("Failed to create event transaction");
    }
}

async function fetchEventTransaction() {
    try {
        await connectToDatabase();
        const transactions = await Transaction.find({ type: 'event' })
            .sort({ createdAt: -1 });
        return transactions;
    } catch (error) {
        console.error("Error fetching event transactions:", error);
        throw new Error("Failed to fetch event transactions");
    }
}

export async function GET() {
    try {
        const transactions = await fetchEventTransaction();
        return NextResponse.json(transactions);
    } catch (error) {
        return NextResponse.json({message:"Error fetching event transaction"}, {status: 500})
    }
}

export async function POST(request: Request) {
    try {
        const {eventId, childId, amount, quantity, datePaid} = await request.json();
        const data = {eventId, childId, amount, quantity, datePaid};
        const response = await createEventTransaction(data);
        return NextResponse.json({message: "POST Event transaction created successfully--"}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: "POST: Failed to create event transaction--"}, {status: 500})
    }
}