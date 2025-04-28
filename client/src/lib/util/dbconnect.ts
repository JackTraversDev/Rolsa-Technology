import mongoose from "mongoose";

// Function to connect to the database

export default async function dbconnect() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL) // Taking the MONGO_URL variable from .env file
        return connection // Returns the connection
    } catch (error) { // Catch any errors
        console.error("Failed to connect to database", error) // Log any errors
        process.exit() // Quit if cannot connect to database
    }
}