import { Inngest } from "inngest";
import connectDB from "../configs/db.js";
import User from "../models/User.js";

// Helper: Ensure DB is connected before each function execution
const ensureDB = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};

// Create Inngest client
export const inngest = new Inngest({ id: "movie-ticket-booking" });

/**
 * Sync user creation from Clerk
 */
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await ensureDB();
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        _id: id,
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url || "",
      };

      await User.create(userData);
      console.log("User created and synced:", userData);
    } catch (err) {
      console.error("Failed to create user:", err.message);
    }
  }
);

/**
 * Sync user deletion from Clerk
 */
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await ensureDB();
    try {
      const { id } = event.data;
      await User.findByIdAndDelete(id);
      console.log("User deleted:", id);
    } catch (err) {
      console.error("Failed to delete user:", err.message);
    }
  }
);

/**
 * Sync user update from Clerk
 */
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    await ensureDB();
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url || "",
      };

      await User.findByIdAndUpdate(id, userData, { new: true });
      console.log("User updated:", userData);
    } catch (err) {
      console.error("Failed to update user:", err.message);
    }
  }
);

// Export all Inngest functions for /api/inngest
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
