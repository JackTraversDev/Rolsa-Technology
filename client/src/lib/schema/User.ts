import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ // Creating a userSchema
    firstName: { type: String, required: true, unique: false },
    lastName: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: false },
    bookings: [],
    boldFont: { type: Boolean, default: false },
    largeText: { type: Boolean, default: false },
    dyslexicFont: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now() }
})

const User = mongoose.model("users", userSchema) // Creating a user model (Collection in the database)

export default User
