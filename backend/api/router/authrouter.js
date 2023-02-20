const { resetPassword, forgetPassword } = require('../controller/authController');

const router = require('express').Router()
router.post("/resetpassword/:token", resetPassword);
router.post('/forgetpassword', forgetPassword)


module.exports = router