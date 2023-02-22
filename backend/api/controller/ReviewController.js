const asyncHandler = require("express-async-handler");
const { Review } = require("../modules/ReviewModel");
const Book = require("../modules/BookModel");
const {validateReview,validateReviewUpdate} = require('./validator')
// @desc Add Rating  to Books
// @route POST /api/reviews/:bookId
// @access private

const addReview = asyncHandler(async (req, res) => {
  const {error} = validateReview(req.body)
  if(error){
    return res.status(400).json({
      msg : error.details[0]
    })
  } 
  const { bookId } = req.params;
  if(bookId.length !== 24){
    return res.status(400).json({
      msg : "Invalid Id Length"
    })
  }
  const userId = req.user.id;
  
  const { comment, rating } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
     return res.status(404).json({
        msg : "Book not Found"
      })
    }
    const review = await Review.create({
      user: userId,
      rating: rating,
      comment: comment,
      book : bookId
    });
    book.reviews.push(review);
    book.save();
    return res.status(200).json(review);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
      error : error
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
      book: bookId
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

// @desc update Rating  to Books
// @route PATCH /api/reviews/:bookId/reviews/:reviewId
// @access private
const updateReview = asyncHandler(async (req, res) => {
  const { reviewId, bookId } = req.params;
  if(reviewId.length !== 24 && bookId.length !== 24){
    return res.status(400).json({
      msg : "Invalid Id "
    })
  }
  try {
     const { error } = validateReviewUpdate(req.body);
     if (error) {
       return res.status(400).json({
         error: error.details[0],
       });
     }
     const userId = req.user.id;
        const review = await Review.findOne({
          _id: reviewId,
          book: bookId,
          user: userId,
        });

    if (!review) {
     return res.status(404).json({
        msg: "Review Not Found",
      });
    }

    // review.rating = rating;
    // review.comment = comment;
    // await review.save();
    const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {new : true})

    res.status(200).json(updatedReview);
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
