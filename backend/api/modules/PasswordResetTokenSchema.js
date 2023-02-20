const mongoose = require('mongoose')
const PasswordResetTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowwercase : true
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    default : Date.now,
    expires : 3600,
  },
});


module.exports = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);