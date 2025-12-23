import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";

const protectRoute = async (request, response, next) => {
  try {
    const token = request.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return response.status(401).json({ message: "No token provided" });
    }

    // Verify token logic here (e.g., using JWT)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    request.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler

  } catch (error) {
    console.error("Authentication error:", error);
    response.status(401).json({ message: "Unauthorized" });
  }
}

export default protectRoute;