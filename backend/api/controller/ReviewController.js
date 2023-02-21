const asyncHandler = require("express-async-handler");
const { Review } = require("../modules/ReviewModel");
const Book = require("../modules/BookModel");
// @desc Add Rating  to Books
// @route POST /api/reviews/:bookId
// @access private

const addReview = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.id;
  console.log(req.params);

  const { comment, rating } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404);
      throw new Error("Book not Found");
    }
    const review = await Review.create({
      user: userId,
      rating: rating,
      comment: comment,
    });
    book.reviews.push(review);
    book.save();
    return res.status(200).json({ review });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

// @desc Delete Rating  to Books
// @route DELETE /api/reviews/:bookId/reviews/:reviewId
// @access private

const deleteReview = asyncHandler(async (req, res) => {
  const { bookId, reviewId } = req.params;
  const userId = req.user.id;

  try {
    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
    });
    if (!review) {
      res.status(404);
      throw new Error("Review Not Found");
    }
    await review.remove();
    res.status(200).json({
      msg: "Revew Removed Scussfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

// @desc Delete Rating  to Books
// @route PATCH /api/reviews/:reviewId
// @access private
const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;
  console.log(reviewId);
  const { rating, comment } = req.body;
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
     return res.status(404).json({
        msg: "Review Not Found",
      });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

module.exports = {
  addReview,
  deleteReview,
  updateReview,
};
