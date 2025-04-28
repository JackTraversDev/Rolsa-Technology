// Importing the necessary libraries and predefined functions

import User from "@/lib/schema/User";
import IronSessionSettings from "@/lib/util/IronSessionSettings";
import { NextResponse } from "next/server";
import dbconnect from "@/lib/util/dbconnect";

export async function GET() {
    try {
        await dbconnect()
        const session = await IronSessionSettings() // Run the IronSessionSettings
        if (session.user) { // If user is logged in
            const foundUser = await User.findById(session.user.id) // find the userdata
            if (!foundUser) {
                return NextResponse.json({
                    error: true,
                    stack: foundUser
                })
            }
            return NextResponse.json({ isLoggedIn: true, firstName: foundUser.firstName, lastName: foundUser.lastName, email: foundUser.email }, { status: 201 }) // return is logged in true and relevant data
        } else {
            return NextResponse.json({ isLoggedIn: false }, { status: 200 })
        }
    } catch (error) { // Catch any errors
        console.error(error) // Log errors to console
        return NextResponse.json({ error, status: 500 }) // Return response with status 500 (internal server error)
    }
}