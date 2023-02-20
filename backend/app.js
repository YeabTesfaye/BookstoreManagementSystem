const express = require("express");
const bodyParser = require("body-parser");
const { errorHandler } = require("./api/middlerware/errorMiddleware");
const bookRouter = require("./api/router/Bookrouter");
const userRouter = require("./api/router/UserRouter");
const adminRouter = require('./api/router/AdminRoute')
const { limiter } = require("./api/middlerware/limiter");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/books", bookRouter);
app.use("/api/user", userRouter);
app.use('/api/admin', adminRouter)

app.use(limiter)
app.use(errorHandler);
module.exports = app;
