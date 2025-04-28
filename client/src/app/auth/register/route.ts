// Imports for relevant libraries and packages

import { NextResponse, type NextRequest } from "next/server";
import User from "@/lib/schema/User";
import bcrypt from "bcrypt"
import dbconnect from "@/lib/util/dbconnect";

// Creating POST route with the type NextRequest for req
export async function POST(req: NextRequest) {
    try { // Try Catch block to ensure proper error handling
        dbconnect() // Connecting to mongoDB database
        const data = await req.json()
        const existingEmail = await User.findOne({ email: data.email }) // using the User Schema and mongoose to search the database for a user with the email provided in the request (prevents duplicates)
        if (existingEmail) {
            return NextResponse.json({ message: "User already exists with that email" }, { status: 403 }) // If there is an existing user, send response with unauthorized status 
        }
        const hashedPassword = await bcrypt.hash(data.password, 10) // Hash the password with salt rounds of 10 using bcrypt library
        const newUser = new User({ // Creating a new User object with the request data
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
        })
        newUser.save() // Save the new user to the database
        return NextResponse.json({ message: "User Registration successful" }, { status: 201 }) // Upon success send a response back to the client stating the registration was successful and provide status 201 (ok)
    } catch (error) {
        return NextResponse.json({ message: "There was an error..", error, status: 500 }) // send error message back to the client with status message 500
    }
}