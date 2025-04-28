// Importing the necessary libraries and predefined functions

import { NextResponse, type NextRequest } from "next/server";
import User from "@/lib/schema/User";
import dbconnect from "@/lib/util/dbconnect";
import { getIronSession } from "iron-session";
import { v4 as uuidv4 } from "uuid";
import Booking from "@/lib/schema/bookings";
import IronSessionSettings from "@/lib/util/IronSessionSettings";

export async function POST(req: NextRequest) {
    try {
        await dbconnect(); // Connecting to database

        const data = await req.json(); // Assigning the request data to the constant data
        const session = await IronSessionSettings(); // Run the predefined IronSessionSettings function

        const foundUser = await User.findById(session.user.id); // Find the users details by their session ID
        if (!foundUser) {
            return NextResponse.json({ message: "You must be logged in to make a booking." }, { status: 403 }); // If the user is not logged in then return response informing them that they must be logged in to make a booking
        }

        const meetingID = uuidv4() as string; // Use the UUID library to create a unique ID for the meeting (Meeting ID)
        foundUser.bookings.push({ meetingID }); //Push the created ID to the users booking array (Contains all of the users booking IDs)

        const newBooking = new Booking({
            meetingID: meetingID,
            bookingType: data.bookingType,
            bookingDate: data.bookingDate,
            bookingTime: data.bookingTime,
            address: data.address,
            customerid: foundUser._id,
        }); // Create a new object storing all data relevant to the booking

        await newBooking.save(); // Save the booking to the bookings collection
        await foundUser.save(); // Save the changes to the user

        return NextResponse.json({ message: "Booking successful" }, { status: 201 }); // Upon success with no errors, return "Booking successful" and status of 201 (ok)
    } catch (error) { // Catch any errors
        console.error(error); // Log the error
        return NextResponse.json({ message: "There was an error processing your request." }, { status: 500 }); // Return response with status of 500 (Internal error)
    }
}