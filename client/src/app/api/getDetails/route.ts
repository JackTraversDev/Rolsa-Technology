// Importing the necessary libraries and predefined functions

import { NextResponse } from "next/server";
import IronSessionSettings from "@/lib/util/IronSessionSettings";
import dbconnect from "@/lib/util/dbconnect";
import User from "@/lib/schema/User";

export async function GET() {
    try {
        dbconnect() // Connect to the database
        const session = await IronSessionSettings() // Run the IronSessionSettings function to fetch userID
        if (!session.user?.id) { // If the user is not logged in
            return NextResponse.json({ message: "Not authenticated" }, { status: 403 }) // Return response with status 403 (not authenticated)
        }
        const foundUser = await User.findById(session.user.id).select("firstName lastName email") // FInd the users data using their userID stored in their session and store their firstName, lastName and email to the constant foundUser
        if (!foundUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 }) // Return response with status 404 (Not found)
        }
        return NextResponse.json({
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email
        }, { status: 201 }) // Return response containing all of the users fetched data with status 201 (Ok)
    } catch (error) { // Catch any errors
        console.error(error) // Catch errors
        return NextResponse.json({ message: "Internal server error, please try again later" }, { status: 500 }) // If there are any errors return next response with status 500
    }
}