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
});
// get all books with pagination
router.get("/", protectRoute, async (request, response) => {
  try {
    const page = request.query.page ? parseInt(request.query.page) : 1;
    const limit = request.query.limit ? parseInt(request.query.limit) : 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })  // descending order
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage"); // populate user details

    const totalBooks = await Book.countDocuments();

    response.send({
      books,
      currentPage: page,
      total: totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});
// get recommended books by the logged in user
router.get("/user", protectRoute, async (request, response) => {
  try {
    const books = await Book.find({ user: request.user._id }).sort({ createdAt: -1 });
    response.json({ books });
  } catch (error) {
    console.error("Error fetching user's books:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});
// delete a book
router.delete("/:id", protectRoute, async (request, response) => {
  try {
    const book = await Book.findById(request.params.id);
    if (!book) {
      return response.status(404).json({ message: "Book not found" });
    }

    // Check if the logged-in user is the owner of the book
    if (book.user.toString() !== request.user._id.toString()) {
      return response.status(403).json({ message: "Forbidden: You cannot delete this book" });
    }

    // delete image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    await book.deleteOne();
    response.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

export default router;