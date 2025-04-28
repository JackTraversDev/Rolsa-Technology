// Importing the necessary libraries and predefined functions

import { NextResponse, type NextRequest } from "next/server";
import dbconnect from "@/lib/util/dbconnect";
import Booking from "@/lib/schema/bookings";
import IronSessionSettings from "@/lib/util/IronSessionSettings";

export async function GET(req: NextRequest) {
    try {
        await dbconnect(); // Connect to database

        const session = await IronSessionSettings() // Run the IronSessionSettings function to get user ID
        if (!session.user || !session.user.id) { // IF the user is not logged in
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 }) // Return response with status 401 (Unauthorized)
        }
        const userBookings = await Booking.find({ customerid: session.user.id }) // Search the Booking collection with the customerID to find all of their created bookings
        return NextResponse.json(userBookings, { status: 201 }) // Return response with the bookings and status 201 (ok)
    } catch (error) { // Catch any errors
        console.error("Error fetching bookings:", error); // Log the error to console
        return NextResponse.json({ message: "Failed to fetch bookings" }, { status: 500 }); // If fetching fails, return response with status 500 (Internal server error)
    }
}