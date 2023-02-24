const Book = require("../modules/BookModel");
const User = require("../modules/userModel");
const Order = require("../modules/OrderModel");
const { validateOrder } = require("./validator");
const asyncHandler = require("express-async-handler");

// @desc place an order
// @route post /api/orders
// @access private
const placeOrder = asyncHandler(async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0],
    });
  }

  try {
    const user = req.user.id;
    const { book, date, quantity, status } = req.body;
    const bookExist = await Book.findById(book);
    // console.log(req.body);
    if (!bookExist) {
      return res.status(400).json({
        msg: "Book Not Found",
      });
    }

    totalPrice = parseInt(parseInt(quantity) * parseInt(bookExist.price));

    const order = await Order.create({
      user,
      book: req.body.book,
      status: req.body.status,
      quantity: req.body.quantity,
      totalPrice,
      date: req.body.date,
    });
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error,
    });
  }
});

// @desc retriving all order from a user
// @route get /api/orders
// @access private

const retriveAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).populate("book");

    if (orders) {
      return res.status(200).json(orders);
    }
    return res.status(400).json({
      msg: "Orders Not Found",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

// @desc updating  order from a user
// @route PATCH /api/orders/:orderId
// @access private

const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (orderId.length !== 24) {
    return res.status(400).json({
      msg: "Invalid Id length",
    });
  }
  const updates = Object.keys(req.body);
  const allowedUpdates = ["status"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).json({
      msg: "Invalid Updates",
    });
  }
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        msg: "Order Not Found",
      });
    }
    order.status = req.body.status;
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server Error",
    });
  }
});
// @desc deleting order
// @route pATCH /api/orders/:orderId
// @access private
const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (orderId.length !== 24) {
    return res.status(400).json({
      msg: "Invalid Id length",
    });
  }
  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({
        msg: "Order Not Found",
      });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

module.exports = {
  placeOrder,
  retriveAllOrders,
  updateOrder,
  deleteOrder,
};
