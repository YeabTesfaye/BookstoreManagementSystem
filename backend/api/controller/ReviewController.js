const asyncHandler = require("express-async-handler");
const Review = require("../modules/ReviewModel");
const Book = require("../modules/userModel");
// @desc Add Rating  to Books
// @route POST /api/reviews/:id
// @access private

const addReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  console.log(req.params);

  const { comment, rating } = req.body;
  try {
    const book = await Book.findById(id);
    if (!book) {
      res.status(404);
      throw new Error("Book not Found");
    }

    const review = await Review.create({
      user: userId,
      rating,
      comment,
    });
    book.review.push(review);
    book.save();
    return res.status(200).json(review);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

// @desc Delete Rating  to Books
// @route DELETE /api/reviews/:id
// @access private

const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const book = await Book.findById(id);
    if (!book) {
      res.status(404);
      throw new Error("Book Not Found");
    }

    const review = await Review.findOne({
      user: userId,
    });
    if (!review) {
      res.status(404);
      throw new Error("The Review Not Found");
    }

    await book.review.pop(review);
    book.save();
    return res.status(200).json({
      msg: "Review Deleted Sucessfully",
    });
  } catch (error) {}
});

// @desc Delete Rating  to Books
// @route PATCH /api/reviews/:id
// @access private
const updateReview = asyncHandler(async (req, res) => {
    const {id} = req.params
    const userId = req.user.id 

    try {
        const book = await Book.findById(id)
        if(!book){
            res.status(404)
            throw new Error('Book Not Found')
        }
        const review = await Review.findOne({
            user : userId
        })
        if(!review){
            res.status(404)
            throw new Error('Review Not Found')
        }
        
        const updatedReview = await Review.findOneAndUpdate({user : userId}, req.body, {new : true})
        
        return res.status(200).json(updatedReview)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
});

module.exports = {
  addReview,
  deleteReview,
  updateReview
};
