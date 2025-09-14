// server/Middleware/auth.js
import { clerkClient, getAuth } from "@clerk/express";

// Authenticate any logged-in user
export const authenticate = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const user = await clerkClient.users.getUser(userId);
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Protect admin routes
export const protectAdmin = async (req, res, next) => {
  try {
    // ✅ Log the incoming Authorization header
    console.log("Authorization header:", req.headers.authorization);
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);

    // Ensure privateMetadata exists
    const role = user?.privateMetadata?.role || "user";

    if (role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Admin protection error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
