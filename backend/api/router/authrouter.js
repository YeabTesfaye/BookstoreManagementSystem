const { resetPassword, forgetPassword, verifyEmail } = require('../controller/authController');

const router = require('express').Router()
router.post("/resetpassword/:token", resetPassword);
router.post('/forgetpassword', forgetPassword)
router.get("/verifyemail/:token", verifyEmail);

module.exports = router