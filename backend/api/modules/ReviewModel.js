const mongoose = require('mongoose')
const Schema = mongoose.Schema
const reviewSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    rating : {
        type : Number,
        required: true,
        min : 1,
        max : 5
    },
    comment : {
        type : String,
        required: true
    },
    book : {
        type: Schema.Types.ObjectId,
        ref : "Book",
        required : true
    }
}, 
{
    timestamps : true
})


const Review = mongoose.model('Review', reviewSchema);
module.exports = {
    reviewSchema,
    Review
}