const { addReview, updateReview, deleteReview } = require('../controller/ReviewController')
const { protect } = require('../middlerware/authMiddleWare')

const router = require('express').Router()

router.post("/:bookId", protect, addReview);
router.patch("/:reviewId", protect, updateReview);
router.delete("/:reviewId", protect, deleteReview);

module.exports = router

