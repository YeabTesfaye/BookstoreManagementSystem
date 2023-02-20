const bcrypt = require("bcryptjs");
const User = require('../modules/userModel')
const asyncHandler = require('express-async-handler')
// Define a function to hash a password with bcrypt
const hashPassword = asyncHandler(async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
});

// Define a function to compare a password with a hashed password
const comparePassword = asyncHandler(async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
});

// Define a function to register a new user
const registerUser = asyncHandler(async (name, email, password, age, gender, address) => {
  // Hash the user's password
  const hashedPassword = await hashPassword(password);

  // Create a new User document

  const user = await User.create({
    name,
    email,
    age,
    gender,
    address,
    password: hashedPassword,
  });
  // Save the new User document to the database
//   await user.save();

  res.status(200).json(user)
});


// Define a function to log in a user
const loginUser = asyncHandler(async (email, password) => {
  // Find the User document with the given email
  const user = await User.findOne({email})

  // If no User document is found with the given email, return null
  if (!user) { 
    return null;
  }

  // Compare the entered password with the hashed password stored in the database
  const passwordMatch = await comparePassword(password, user.password);

  // If the passwords don't match, return null
  if (!passwordMatch) {
    return null;
  }

  // If the passwords match, return the User document
  return user;
});


module.exports = {
 loginUser,
 registerUser
}