const mongoose=require('mongoose');


const userSchema=mongoose.Schema({
    fullname : String,
    email: String,
    password:String,
    posts:{
        type:Array,
        default:[],
    },
    contact:Number,
    picture:String,
})

module.exports=mongoose.model('users',userSchema);