const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {reviewSchema} = require('./ReviewModel')
const bookSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true, minLength: 3, maxLength: 100 },
  author: { type: String, required: true, minLength: 3, maxLength: 100 },
  publisher: {
    type: String,
    enum: ["Penguin", "HarperCollins", "Random House"],
    required: true,
  },
  isbn : {
    type: String,
    required: true,
    match: /^(?:\d[\ |-]?){13}$/
  },
  description: { type: String, required: true, minLength: 10, maxLength: 200 },
  price: { type: Number, default: 0 },
  publishedDate: { type: Date, default: Date.now() },
  reviews: [reviewSchema],
  avaliable: { type: Boolean, required: true },
  type: { type: String, required: true },
  photo : {type: String, }
});

module.exports = mongoose.model("Book", bookSchema);
