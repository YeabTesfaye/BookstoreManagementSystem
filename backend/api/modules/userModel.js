const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  name: { type: String, required: true, minLength: 3, maxLength: 20 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6, maxLength: 100 },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
