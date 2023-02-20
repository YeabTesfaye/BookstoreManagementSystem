const Joi = require("joi");
const validator = (schema) => (pyload) =>
  schema.validate(pyload, { abortEarly: false });

const bookShema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  author: Joi.string().min(3).max(100).required(),
  publisher: Joi.string()
    .valid("Penguin, HarperCollins, Random House")
    .required(),
  isbn: Joi.string()
    .regex(/^\d{10}|\d{13}$/)
    .required(),
  description: Joi.string().min(10).max(200).required(),
  price: Joi.number().required().positive(),
});

const userSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string()
    .required()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: Joi.string().min(6).max(100).required(),
  age: Joi.number().positive(),
  gender: Joi.string().valid("Male Female Other"),
  publishedDate : Joi.date()
});

exports.validateBook = validator(bookShema);
exports.validateUser = validator(userSchema);
