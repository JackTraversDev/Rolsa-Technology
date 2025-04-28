// Importing the necessary libraries and predefined functions

import { type NextRequest, NextResponse } from "next/server";
import IronSessionSettings from "@/lib/util/IronSessionSettings";
import bcrypt from "bcrypt"
import dbconnect from "@/lib/util/dbconnect";
import User from "@/lib/schema/User";

export async function POST(req: NextRequest) {
    try {
        dbconnect() // Connected to database
        const session = await IronSessionSettings() // Run the IronSessionSettings function to attempt retrieving the user id
        if (!session.user) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 403 }) // If the user is not logged in / a session is not stored, return response 403 (Unauthorized)
        }
        const data = await req.json() // Storing the request data into the constant data
        const foundUser = await User.findById(session.user.id) // Find the users collection using their ID stored in the users session
        if (!foundUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 }) // If the user cannot find the user in the database, returns response with status 404 (not found)
        }
        const existingUser = await User.findOne({ email: data.email })
        if (existingUser && existingUser.id !== foundUser.id) {
            return NextResponse.json({ message: "A user already exists with this email" }, { status: 403 })
        }
        // Replacing data
        if (data.firstName) foundUser.firstName = data.firstName
        if (data.lastName) foundUser.lastName = data.lastName
        if (data.email) foundUser.email = data.email

        if (data.password) { // If the user is trying to update their password
            const hashedPassword = await bcrypt.hash(data.password, 10) // Hash password with salt rounds of 10 using bcrypt
            foundUser.password = hashedPassword // Updating the password in the users collection
        }
        await foundUser.save(); // Save the changes made

        return NextResponse.json({ message: "profile updated successfully" }, { status: 201 }) // Send response with status 201 (ok)
    } catch (error) { // catch any errors
        console.error(error) // Log the error to console
        return NextResponse.json({ message: "Internal server error, please try again later." }, { status: 500 }) // return response with status 500 (internal server error)
    }
}