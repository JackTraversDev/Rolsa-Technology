import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({ // Creating a booking schema
    meetingID: { type: String, required: true },
    bookingType: { type: String, required: true },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    address: { type: String, required: true },
    BookedDate: { type: Date, required: true, default: Date.now() },
    customerid: { type: mongoose.Schema.ObjectId, ref: 'users' }
});

const Booking = mongoose.model("bookings", bookingSchema); // Creating a booking model (Collection in the database)
export default Booking;