const { retriveAllOrders,placeOrder, updateOrder, deleteOrder } = require('../controller/OrderController')
const { protect } = require('../middlerware/authMiddleWare')
const {authenticateAdmin} = require('../middlerware/authenticateAdmin')
const router = require('express').Router()

router.get('/', protect,retriveAllOrders)
router.post('/', protect,placeOrder)
router.patch('/:orderId',protect,authenticateAdmin, updateOrder)
router.delete("/:orderId", protect, authenticateAdmin, deleteOrder);

module.exports = router