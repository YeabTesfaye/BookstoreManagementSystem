const express = require("express");
const { register, login, updateUser, delteUser } = require("../controller/UserController");
const { protect } = require("../middlerware/authMiddleWare");

const router = express.Router();
router.post("/", register);
router.post("/login", login);
router.patch("/profile",protect ,updateUser)
router.delete('/account',protect ,delteUser)

module.exports = router;
