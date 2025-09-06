const mongoose = require ('mongoose')
const AddStoreSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
    
})
module.exports = mongoose.model('AddStore', AddStoreSchema)
