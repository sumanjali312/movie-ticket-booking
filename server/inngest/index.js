import { Inngest } from "inngest";
import User from "../models/User.js"; // adjust path to your User model

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Function to create user
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    await User.create(userData);
    console.log("User created and synced:", userData);
  }
);

// Function to delete user
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
    console.log("User deleted:", id);
  }
);

// Function to update user
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    await User.findByIdAndUpdate(id, userData, { new: true });
    console.log("User updated:", userData);
  }
);

// Export functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation
];
