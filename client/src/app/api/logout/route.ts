// Importing the necessary libraries and predefined functions

import { NextResponse } from "next/server";
import IronSessionSettings from "@/lib/util/IronSessionSettings";

export async function POST() {
    try {
        const session = await IronSessionSettings() // Run the IronSessionSettings function to get the logged in users id
        if (!session.user) { // If user not logged in
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 }) // Return response with status code 403 (Unauthorized)
        }
        session.destroy() // Destroy the session
        return NextResponse.json({ message: "Logout successful" }, { status: 201 }) // Respond with status 201 (ok)
    } catch (error) { // Catch any errors
        console.error(error) // Log errors to console
        return NextResponse.json({ message: "Internal server error, please try again later." }, { status: 500 }) // If there is an error, return response with status 500 (Internal server error)
    }
}