const Joi = require("joi");
const validator = (schema) => (pyload) =>
  schema.validate(pyload, { abortEarly: false });
// .valid("Penguin, HarperCollins, Random House")
const bookShema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  author: Joi.string().min(3).max(100).required(),
  publisher:
    Joi.string()
    .required(),
  isbn: Joi.string()
    .regex(/^(?:\d[\ |-]?){13}$/)
    .required(),
  avaliable: Joi.boolean().required(),
  description: Joi.string().min(10).max(200).required(),
  price: Joi.number().required().positive(),
  type: Joi.string().required(),
});

const userSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string()
    .required()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  password: Joi.string().min(6).max(100).required(),
  confirmPassword: Joi.ref("password"),
  age: Joi.number().positive(),
  // gender: Joi.string().valid("Male Female Other").required(),
  isAdmin: Joi.boolean(),
  DOB: Joi.date().greater("1909-02-22").required(),
  // addres : {
  //   state : Joi.string().length(2).required()
  // }
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  password: Joi.string().min(6).max(100),
  age: Joi.number().positive(),
  gender: Joi.string().valid("Male Female Other"),
  isAdmin : Joi.boolean(),
  DOB : Joi.date().greater("1909-02-22")
});


const updateBookSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  author: Joi.string().min(3).max(100),
  publisher: Joi.string(),
  isbn: Joi.string()
    .regex(/^(?:\d[\ |-]?){13}$/),
  avaliable: Joi.boolean(),
  description: Joi.string().min(10).max(200),
  price: Joi.number().positive(),
  type: Joi.string(),
});

const reviewSchema = Joi.object({
  rating : Joi.number().min(1).max(5).required(),
  comment : Joi.string().required()
})
const reviewUpdateSchema = Joi.object({
  rating: Joi.number().min(1).max(5),
  comment: Joi.string(),
});
exports.validateBook = validator(bookShema);
exports.validateUser = validator(userSchema);
exports.validateUserUpdate = validator(updateUserSchema)
exports.validateBookUpdate = validator(updateBookSchema)
exports.validateReview = validator(reviewSchema)
exports.validateReviewUpdate = validator(reviewUpdateSchema)