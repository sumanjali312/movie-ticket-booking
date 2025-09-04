import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Clerk user ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  image: { type: String }, // Clerk profile image
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
