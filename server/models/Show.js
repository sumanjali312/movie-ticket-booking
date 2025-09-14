// models/Show.js
import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  theatre: { type: String, required: true },
  showDateTime: { type: Date, required: true },
  showPrice: { type: Number, required: true },
  // Use Map to store occupied seat -> userId (string)
  occupiedSeats: {
    type: Map,
    of: String,
    default: {}
  },
}, { timestamps: true });

const Show = mongoose.model("Show", showSchema);
export default Show;
