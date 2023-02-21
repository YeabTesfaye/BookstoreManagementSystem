const { addReview, updateReview, deleteReview } = require('../controller/ReviewController')
const { protect } = require('../middlerware/authMiddleWare')

const router = require('express').Router()

router.post('/:id', protect,addReview)
router.patch('/:id', protect,updateReview)
router.delete('/:id',protect,deleteReview)

module.exports = router