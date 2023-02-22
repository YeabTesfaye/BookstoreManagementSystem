const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const User = require("../modules/userModel");
const { validateUser, validateUserUpdate } = require("./validator");
const nodemailer = require("nodemailer");


// @desc register user
// @route post /api/user
// @access public

const register = asyncHandler(async (req, res) => {
  
  const {error, value} = validateUser(req.body);
  if(error){
    return res.status(400).json({
      msg : error.details[0]
    })
  }
  const { name, email, password ,age, gender, address, DOB,isAdmin } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(404);
    throw new Error("The User is Already Exist");
  }
  
  const verificationToken =  crypto.randomBytes(20).toString('hex')
  
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    age,
    gender,
    address,
    isAdmin,
    verificationToken,
    DOB,
    password: hashedPassword,
  });
  const verificationUrl = process.env.CLIENT_URL + "/verifyemail" + `/${verificationToken}`;
  
  
  if (!user) {
    res.status(500);
    throw new Error("Internal Server Error");
  } else {
     const transporter = nodemailer.createTransport({
       service: "gmail",
       auth: {
         user: process.env.EMAIL_ADDRESS,
         pass: process.env.EMAIL_PASSWORD,
       },
     });
     const mailOptions = {
       from: process.env.EMAIL_ADDRESS,
       to: email,
       subject: "Email Verification",
       html: `
         <h3>Verify your Email</h3>
         <a href=${verificationUrl}>${verificationUrl}</a>
       `,
     }; 

     transporter.sendMail(mailOptions, (error , info) => {
      if(error){
        console.log(error)
        throw new Error('Something Goes Wrong')
      }
      else{
        console.log("Email Sent", info.response)
      }
     })
     res.status(200).json({
      _id : user._id,
      link : verificationUrl
     })
  }
});

// @desc login user
// @route post /api/user/login
// @access private

const login = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });
  if(!user){
   return res.status(401).json({
      msg : "Invalide Email or password"
    })
  }
  if (!user.isEmailVerified){
    res.status(401).json({
      msg : "Email Is Not Verifed"
    })
  }
    if (password && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        gender: user.gender,
        isAdmin : user.isAdmin,
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
  if(!req.user){
    return res.status(401).json({
      msg : "Auth Failed"
    })
  }
  const  {error} = validateUserUpdate(req.body);
  if(error){
    return res.status(400).json({
      msg : error.details[0]
    })
  }
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
  if(!req.user){
    return res.status(401).json({
      msg : "Auth Failed"
    })
  }
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
