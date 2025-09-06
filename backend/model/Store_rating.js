const mongoose = require('mongoose');
const StoreRatingSchema  = new mongoose.Schema({
    storeID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'AddStore',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})
module.exports = mongoose.model('StoreRating', StoreRatingSchema)

