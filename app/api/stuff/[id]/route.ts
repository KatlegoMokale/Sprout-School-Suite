import { connectToDatabase } from "@/lib/mongodb";
import Staff from "@/lib/models/Staff";
import { NextResponse } from "next/server";

//Fetch Staff
async function fetchStaff(id: string) {
    try {
        console.log('Fetching staff with ID:', id);
        await connectToDatabase();
        const staff = await Staff.findById(id);
        if (!staff) {
            throw new Error("Staff not found");
        }
        console.log('Found staff:', staff);
        return staff;
    } catch (error) {
        console.error("Error fetching Staff:", error);
        throw new Error("Failed to fetch Staff");
    }
}

//Delete Staff
async function deleteStaff(id: string) {
    try {
        console.log('Deleting staff with ID:', id);
        await connectToDatabase();
        const staff = await Staff.findByIdAndDelete(id);
        if (!staff) {
            throw new Error("Staff not found");
        }
        console.log('Deleted staff:', staff);
        return staff;
    } catch (error) {
        console.error("Error deleting Staff:", error);
        throw new Error("Failed to delete Staff");
    }
}

//Update Staff
async function updateStaff(id: string, data: any) {
    try {
        console.log('Updating staff with ID:', id);
        console.log('Update data:', data);
        await connectToDatabase();
        const staff = await Staff.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true }
        );
        if (!staff) {
            throw new Error("Staff not found");
        }
        console.log('Updated staff:', staff);
        return staff;
    } catch (error) {
        console.error("Error updating Staff:", error);
        throw new Error("Failed to update Staff");
    }
}

export async function GET(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params;
        console.log('GET /api/stuff/[id] called with ID:', id);
        const staff = await fetchStaff(id);
        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        console.error('GET /api/stuff/[id] error:', error);
        return NextResponse.json({ message: "Error fetching Staff" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params;
        console.log('DELETE /api/stuff/[id] called with ID:', id);
        const staff = await deleteStaff(id);
        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        console.error('DELETE /api/stuff/[id] error:', error);
        return NextResponse.json({ message: "Error deleting Staff" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params;
        console.log('PATCH /api/stuff/[id] called with ID:', id);
        const body = await request.json();
        console.log('PATCH request body:', body);
        const staff = await updateStaff(id, body);
        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        console.error('PATCH /api/stuff/[id] error:', error);
        return NextResponse.json({ message: "Error updating Staff" }, { status: 500 });
    }
}
