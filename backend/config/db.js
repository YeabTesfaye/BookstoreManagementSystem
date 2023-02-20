const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const url = "mongodb://localhost:27017/BookStore";

const CONNECTDB = async () => {
  try {
    const conn = await mongoose.connect(url);
    console.log(`MongoDB Connected ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = CONNECTDB;
