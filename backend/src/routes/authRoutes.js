import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (request, response) => {
  try {
    const { username, email, password } = request.body;
    if (!username || !email || !password) {
      return response.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return response.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    if (username.length < 3) {
      return response.status(400).json({ message: "Username must be at least 3 characters long" });
    }

    // check if user already exists in the database
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return response.status(400).json({ message: "Email already in use" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return response.status(400).json({ message: "Username already in use" });
    }

    // get random avatar from dicebear
    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

    const user = new User({ username, email, password, profileImage });
    await user.save();

    const token = generateToken(user._id);
    response.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    response.status(500).json({ message: "Internal server error" });
  }
})
router.post("/login", async (request, response) => {
  response.send("login")
})

export default router;