const asyncHandler = require("express-async-handler");
const User = require("../modules/userModel");
const PasswordResetToken = require("../modules/PasswordResetTokenSchema");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');

// @desc forgetpassword
// @route post /api/auth/forgotpassword
// @access private
const forgetPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "The user is Not Found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // expire after 1 hour

    const passowrdToken = await PasswordResetToken.create({
      email,
      token,
      expires,
    });

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
      subject: "Password Reset Request",
      html: `
        <p>Hello,</p>
        <p>You are receiving this email because you requested a password reset for your account.</p>
        <p>Please click on the following link to reset your password:</p>
        <a href="${process.env.CLIENT_URL}/reset-password/${token}">${process.env.CLIENT_URL}/reset-password/${token}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>Thank you,</p>
        <p>Your Application Team</p>
      `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new Error("Something Went Wrong");
      } else {
        console.log("Email Sent", info.response);
      }
    });
    console.log(process.env.CLIENT_URL);
    link = process.env.CLIENT_URL + "/resetpassword" + `/${token}`
    return res.status(200).json({ message: "Password reset email sent", link});
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
});
// @desc reset password
// @route post /api/auth/resetpassword/:token
// @access private
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const {token} = req.params 
  const passwordReset = await PasswordResetToken.findOne({token});
 
  
  if (!passwordReset) {
    return res.status(404).json({ message: "Invalid token" });
  }

  if (passwordReset.expires < new Date()) {
    await passwordReset.remove();
    return res.status(404).json({ message: "Token has expired" });
  }
  const user = await User.findOne({ email: passwordReset.email });

  if (!user) {
    await passwordReset.remove();
    return res.status(404).json({ message: "User not found" });
  }
  const salt = await bcrypt.genSalt(10)
  const hasedPassword = await bcrypt.hash(password , salt)
  user.password = hasedPassword
  await user.save()
  await passwordReset.remove()
  return res.status(200).json({
    msg : "the password updated sucess fully"
  })
});

module.exports = {
  forgetPassword,
  resetPassword,
};
