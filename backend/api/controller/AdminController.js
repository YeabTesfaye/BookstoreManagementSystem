const asyncHandler = require("express-async-handler");
const User = require("../modules/userModel");
// @desc get All  user profile
// @route Delte /api/admin/users
// @access private

const allUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({isAdmin: false}).lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(200);
    throw new Error("Internal Server Errr");
  }
});

// @desc Delte  user profile
// @route Delete api/admin/users/:id
// @access private

const delelteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc update  user profile
// @route Pach api/admin/users/:id
// @access private

const updateUser = asyncHandler(async(req,res, next) => {
    try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = {
    delelteUser,
    allUsers,
    updateUser
}