const asyncHandler = require("express-async-handler");
const Book = require("../modules/BookModel");
const User = require("../modules/userModel");
const { validateBook } = require("./validator");
// @desc get Books
// @route GET /api/books
// @access private

const getBooks = asyncHandler(async (req, res) => {
  // const sort = req.query.sort || "-publishedDate";
  const userId = req.user.id;
  const { sortBy, sortOrder, filterBy, filterValue, page, pageSize } =
    req.query;

  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  // construct the filter object based on the filter parameters
  const filter = {};
  if (filterBy && filterValue) {
    filter[filterBy] = filterValue;
  }

  // calculate the skip and limit values based on the page and pageSize parameters
  const skip = page && pageSize ? (page - 1) * pageSize : 0;
  const limit = pageSize ? parseInt(pageSize) : 0;

  // const books = await Book.find().populate("owner", "username").sort(sort);
  const books = await Book.find({ owner: userId, ...filter })
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // count the total number of books to calculate the total number of pages
  const totalBooks = await Book.countDocuments({ owner: userId, ...filter });
  const totalPages = pageSize ? Math.ceil(totalBooks / pageSize) : 1;
  
  if (books) return res.status(200).json({books, totalPages});
  res.status(500).json({ message: err.message });
});

// @desc post books
// @route POST /api/books
// @access private

const postBooks = asyncHandler(async (req, res) => {
  validateBook(req.body);
  // const user = await User.findById(req.user._id);

  const { title, author, publisher, isbn, description, price, publishedDate } =
    req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("The User Dosn't Exist");
  }

  const book = await Book.create({
    title,
    author,
    publisher,
    isbn,
    description,
    price,
    publishedDate,
    owner: req.user.id,
  });

  user.books.push(book._id);
  await user.save();

  if (book) {
    res.status(200).json({
      book,
    });
  } else {
    res.status(500).json({
      msg: "Server Error",
    });
  }
});

// @desc update books
// @route POST /api/books/:id
// @access private
const updateBooks = asyncHandler(async (req, res) => {
  // validateBook(req.body)
  const { id } = req.params;
  const bookExist = await Book.findById(id).populate("owner");

  if (!bookExist) {
    res.status(404);
    throw new Error("book not found");
  }

  if (bookExist.owner._id.toString() !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json(updatedBook);
});

// @desc delete books
// @route DELETE /api/books/:id
// @access private

const deleteBooks = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bookExist = await Book.findById(id).populate("owner");

  if (!bookExist) {
    throw new Error("book Doen't Exist");
  }

  if (bookExist.owner._id.toString() !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const book = await Book.findByIdAndDelete(id);
  res.status(200).json(book);
});

// @desc geting user with books
// @route POST /api/books/user
// @access private

const userWithBooks = asyncHandler(async (req, res) => {
  const userWithBooks = await User.findById(req.user.id).populate("books");
  console.log(userWithBooks);

  if (userWithBooks._id.toString() !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!userWithBooks) {
    res.status(401);
    throw new Error("The User Dosn't Exist");
  } else {
    res.status(200).json({
      books: userWithBooks.books,
    });
  }
});

// @desc book searching
// @route POST /api/books/search
// @access private

// Define the search route
const serachBooks = asyncHandler(async (req, res) => {
  const query = req.query.q; // Get the search query from the request query string
  try {
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate("owner", "username"); // Find books that match the search query and populate the 'owner' field with the 'username' property
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {
  postBooks,
  getBooks,
  updateBooks,
  deleteBooks,
  userWithBooks,
  serachBooks,
};
