const { retriveAllOrders,placeOrder } = require('../controller/OrderController')
const { protect } = require('../middlerware/authMiddleWare')

const router = require('express').Router()

router.get('/', protect,retriveAllOrders)
router.post('/', protect,placeOrder)

module.exports = router