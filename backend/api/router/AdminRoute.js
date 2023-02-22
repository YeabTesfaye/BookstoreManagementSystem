const { allUsers, delelteUser, updateUser } = require('../controller/AdminController');
const { authenticateAdmin } = require('../middlerware/authenticateAdmin');
const { protect } = require('../middlerware/authMiddleWare');

const router = require('express').Router()
router.get("/users", protect, authenticateAdmin,allUsers);
router.delete('/users/:id', protect, authenticateAdmin, delelteUser)
router.patch('/users/:id', protect,authenticateAdmin, updateUser)


module.exports = router