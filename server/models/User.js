import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // only used for JWT/local auth
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Clerk integration
    clerkId: { type: String, unique: true, sparse: true },
    image: { type: String }, // Clerk profile image

    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Movie",
      default: [],
    },
  },
  { timestamps: true }
);

// Hash password if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
