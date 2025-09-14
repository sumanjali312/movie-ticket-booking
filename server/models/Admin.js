import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // link to Clerk user
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: "admin" }, // or "superadmin"
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
