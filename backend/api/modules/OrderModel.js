const mongoose = require("mongoose");
const Schema = mongoose.Schema;

export const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ type: Schema.Types.ObjectId, ref: "Book", required: true }],
  orderDate: { type: Date, default: Date.now() },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered"],
    default: "Pending",
  },
  quantity : {
    type : Number,
    default : 1
  }
});



const Order = mongoose.model('Order', orderSchema)
module.exports = {
    Order
}
