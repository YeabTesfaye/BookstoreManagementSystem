
const express = require("express");
const { postBooks, getBooks, updateBooks, deleteBooks, userWithBooks, serachBooks } = require("../controller/BookController");
const { protect } = require("../middlerware/authMiddleWare");

const router = express.Router();

router.post('/',protect , postBooks)
router.get('/',protect,getBooks)
router.patch('/:id',protect , updateBooks)
router.delete('/:id',protect,deleteBooks)
router.post('/user',protect ,userWithBooks)
router.get('/search',protect,serachBooks)
module.exports = router;
