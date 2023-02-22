const asyncHandler = require("express-async-handler");
const Book = require("../modules/BookModel");
const User = require("../modules/userModel");
const { validateBook, validateBookUpdate } = require("./validator");
// @desc get Books
// @route GET /api/books
// @access private

const getBooks = asyncHandler(async (req, res) => {
  // const sort = req.query.sort || "-publishedDate";
  if (!req.user) {
    return res.status(401).json({
      msg: "Auth Failed",
    });
  }
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

  if (books) return res.status(200).json({ books, totalPages });
  res.status(500).json({ message: err.message });
});

// @desc post books
// @route POST /api/books
// @access private

const postBooks = asyncHandler(async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0],
    });
  }

  const {
    title,
    author,
    publisher,
    isbn,
    description,
    price,
    publishedDate,
    avaliable,
    type,
  } = req.body;
  const bookExist = await Book.findOne({ isbn });
  if (bookExist) {
    return res.status(400).json({
      msg: `Book With ${isbn} Exist Already`,
    });
  }

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
    avaliable,
    type,
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
  const { error } = validateBookUpdate(req.body);
  if (error) {
    return res.status(400).json({
      msg: error.details[0],
    });
  }
  try {
    const { id } = req.params;
   
    if(id.length !== 24 ){
      return res.status(400).json({
        msg : "Invalid Id length"
      })
    }
    const bookExist = await Book.findById(id).populate("owner");
  
    if (!bookExist) {
     return res.status(404).json({
        msg : "book not found"
      })
    }
  
    if (bookExist.owner._id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
  
    res.status(200).json(updatedBook);
  } 
  catch (error) {
  
   return res.status(500).json({
    msg : "Internal Server Error",
    error : error
   }) 
  }
});

// @desc delete books
// @route DELETE /api/books/:id
// @access private

const deleteBooks = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if(id.length !== 24){
    return res.status(400).json({
      msg : "Invalid Id length"
    })
  }
  try {
    const bookExist = await Book.findById(id).populate("owner");

    if (!bookExist) {
      return res.status(400).json({
        msg : "Book Doesn'\t Exist"
      })
    }

    if (bookExist.owner._id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const book = await Book.findByIdAndDelete(id);
    res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      msg : "Internal Server Error",
      error : error
    })
  }
});

// @desc geting user with books
// @route Get /api/books/user
// @access private

const userWithBooks = asyncHandler(async (req, res) => {
  const userWithBooks = await User.findById(req.user.id).populate("books");
  // console.log(userWithBooks);

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
