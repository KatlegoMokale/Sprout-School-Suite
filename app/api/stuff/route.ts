import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Staff from "@/lib/models/Staff";

// Create staff
async function createStaff(data: {
    firstName: string;
    secondName?: string;
    surname: string;
    dateOfBirth: string;
    gender: string;
    idNumber: string;
    position: string;
    contact: string;
    email: string;
    address?: any;
    status?: string;
}) {
    try {
        console.log('Creating staff with data:', data);
        await connectToDatabase();
        const staff = new Staff({
            ...data,
            status: data.status || 'active'
        });
        const response = await staff.save();
        console.log('Staff created successfully:', response);
        return response;
    } catch (error) {
        console.error("Error creating Staff:", error);
        throw new Error("Failed to create Staff");
    }
}

async function fetchStaff() {
    try {
        console.log('Fetching staff...');
        await connectToDatabase();
        console.log('Connected to database, querying staff collection...');
        const staff = await Staff.find()
            .sort({ firstName: 1 })
            .lean()
            .exec();
        console.log('Fetched staff count:', staff.length);
        console.log('Fetched staff data:', JSON.stringify(staff, null, 2));
        return staff;
    } catch (error) {
        console.error("Error fetching Staff:", error);
        throw new Error("Failed to fetch Staff");
    }
}

export async function GET() {
    try {
        console.log('GET /api/stuff called');
        const staff = await fetchStaff();
        console.log('Sending staff response:', JSON.stringify(staff, null, 2));
        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        console.error('GET /api/stuff error:', error);
        return NextResponse.json({ message: "Error fetching Staff" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        console.log('POST /api/stuff called');
        const body = await request.json();
        console.log('POST request body:', body);
        const staff = await createStaff(body);
        console.log('Staff created successfully:', staff);
        return NextResponse.json(staff, { status: 201 });
    } catch (error) {
        console.error('POST /api/stuff error:', error);
        return NextResponse.json({ message: "Error creating Staff" }, { status: 500 });
    }
}