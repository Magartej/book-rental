const express = require("express");
const Book = require("./book.model");
const {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  searchBooks,
  getRecommendedBooks,
} = require("./book.controller");
const { verifyToken } = require("../middleware/auth");
const { hasPermission, PERMISSIONS } = require("../middleware/roles");

const router = express.Router();

// post a book (Admin only)
router.post(
  "/create-book",
  verifyToken,
  hasPermission(PERMISSIONS.CREATE_BOOK),
  createBook
);

// get all books (All users)
router.get("/", getAllBooks);

// search books endpoint (All users)
router.get("/search", searchBooks);

// get recommended books endpoint (All users)
router.get("/recommended", getRecommendedBooks);

// single book endpoint (All users)
router.get("/:id", getSingleBook);

// update a book endpoint (Admin only)
router.put(
  "/edit/:id",
  verifyToken,
  hasPermission(PERMISSIONS.UPDATE_BOOK),
  updateBook
);

// delete a book endpoint (Admin only)
router.delete(
  "/:id",
  verifyToken,
  hasPermission(PERMISSIONS.DELETE_BOOK),
  deleteBook
);

module.exports = router;
