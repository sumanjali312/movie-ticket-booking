import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    amount: { type: Number, required: true },
    bookedSeats: { type: [String], required: true }, // array of seat numbers
    isPaid: { type: Boolean, default: false },
    paymentLink: { type: String }, // optional, for online payment
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
