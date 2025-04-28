// Importing the necessary libraries and predefined functions

import { type NextRequest, NextResponse } from "next/server";
import IronSessionSettings from "@/lib/util/IronSessionSettings";
import User from "@/lib/schema/User";
import dbconnect from "@/lib/util/dbconnect";

export async function POST(req: NextRequest) {
    try {
        dbconnect() // Connect to database
        const data = await req.json() // Assign the request data to the constant data
        const session = await IronSessionSettings() // Run the predefined function IronSessionSettings
        const foundUser = await User.findById(session.user.id) // Find user data with findById using userID
        if (!foundUser) { // If user isnt found
            return NextResponse.json({ message: "Could not find user" }, { status: 404 }) // Return status 404 (not found)
        }
        // Update the fields with new data
        foundUser.boldFont = data.boldFont
        foundUser.largeText = data.largeText
        foundUser.dyslexicFont = data.dyslexicFont
        await foundUser.save() // save the fields
        return NextResponse.json({ message: "Successfully updated accessability settings" }, { status: 201 }) // Respond with status 201 (ok)
    } catch (error) { // Catch any errors
        console.error(error) // Log any errors to console
        return NextResponse.json({ message: "Internal server error, please try again later." }, { status: 503 }) // Return response with status 500 (Internal server error)
    }
}