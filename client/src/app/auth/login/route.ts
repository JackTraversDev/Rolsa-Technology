// Imports for relevant libraries and packages


import User from "@/lib/schema/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import dbconnect from "@/lib/util/dbconnect";
import IronSessionSettings from "@/lib/util/IronSessionSettings";

// Creating POST route with the type NextRequest for req
export async function POST(req: NextRequest) {
    try {  // Try Catch block to ensure proper error handling
        dbconnect() // Connecting to mongoDB database
        const session = await IronSessionSettings() // use the imported iron-session function
        const data = await req.json() // Collecting the data from the api request and assigning it to the variable data
        const foundUser = await User.findOne({ email: data.email }) // Using the imported User schema and mongoose to find the account that uses the email within the request
        if (!foundUser) {
            return NextResponse.json({ message: "Invalid Credentials" }, { status: 404 }) // If the requested user is not found, status 404 is returned (not found)
        }
        const passwordMatch = await bcrypt.compare(data.password, foundUser.password) // Using bcrypt to check the password from the request and the found users password to see if they are a match
        if (passwordMatch) {
            session.user = {
                id: foundUser._id.toString() // If the passwords match, a session is created containing that users id from the database, allowing the frontend to easily request and get required data dynamically
            }
            await session.save() // Save the session
            return NextResponse.json({ message: "User logged in" }, { status: 201 }) // Return next response with status of 201 (ok) upon save
        }
        return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 }) // return next response with status 401 (unauthorized) if the provided password does not match the found users password
    } catch (error) { // catch any errors
        return NextResponse.json({ message: "There was an error..", error: error }, { status: 500 }) // IF there is an internal error it is sent back to the client with status 500
    }
}