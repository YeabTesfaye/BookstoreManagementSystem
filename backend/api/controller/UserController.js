const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../modules/userModel");
const { validateUser } = require("./validator");

// @desc register user
// @route post /api/user
// @access public

const register = asyncHandler(async (req, res) => {
  validateUser(req.body);
  const { name, email, password, age, gender, address, isAdmin } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(404);
    throw new Error("The User is Already Exist");
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    age,
    gender,
    address,
    isAdmin,
    password: hashedPassword,
  });
  if (!user) {
    res.status(404);
    throw new Error("Some Thing Goes Wrong");
  } else {
    res.status(200).json({
      _id: user._id,
    });
  }
});

// @desc login user
// @route post /api/user/login
// @access private

const login = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });

  if (password && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      gender: user.gender,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Authintication Failed");
  }
});

// @desc update  user profile
// @route PACH /api/user/profile
// @access private

const updateUser = asyncHandler(async (req, res) => {
  validateUser(req.body);
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });
  if (user) {
    return res.status(200).json(user);
  }
  res.status(500);
  throw new Error("Internal Server Error");
});

// @desc delete  user profile
// @route PACH /api/user/account
// @access private

const delteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);
  if (user) {
    return res.status(200).json(user);
  }
  res.status(500);
  throw new Error("Internal Server Error");
});

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "12d",
  });
};

module.exports = {
  login,
  register,
  updateUser,
  delteUser,
};
