// Importing the necessary libraries and predefined functions

import { NextResponse } from "next/server";
import IronSessionSettings from "@/lib/util/IronSessionSettings";
import User from "@/lib/schema/User";
import dbconnect from "@/lib/util/dbconnect";

export async function GET() {
    try {
        dbconnect() // Connect to database
        const session = await IronSessionSettings() // Run the IronSessionSettings function to get logged in usersID
        if (!session.user.id) { // If the user is not logged in
            return NextResponse.json({ message: "Could not find user" }, { status: 404 }) // return response with status 404 (not found)
        }
        const foundUser = await User.findById(session.user.id) // Find the users data using their ID that was stored in the session
        return NextResponse.json({ boldFont: foundUser.boldFont, largeText: foundUser.largeText, dyslexicFont: foundUser.dyslexicFont }, { status: 201 }) // Upon Success return the users accessability settings with the status of 201 (ok)
    } catch (error) { // Catch error
        console.error(error) // Log error to console
        return NextResponse.json({ message: "Internal server error, please try again later." }, { status: 500 }) // Return response with status 500 (Internal server error)
    }
}