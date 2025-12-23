import express from "express";
import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// create a book
router.post("/", protectRoute, async (request, response) => {
  try {
    const { title, caption, rating, image } = request.body;
    if (!title || !caption || !rating || !image) {
      return response.status(400).json({ message: "All fields are required" });
    }

    // upload the image to cloudinary
    const uploadResult = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResult.secure_url;

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      // user: request.user._id,
    });
    const savedBook = await newBook.save();
    response.status(201).json({
      message: "Book created successfully",
      book: savedBook,
    });

  } catch (error) {
    console.error("Error creating book:", error);
    response.status(500).json({ message: "Internal server error" });
  }
})

export default router;