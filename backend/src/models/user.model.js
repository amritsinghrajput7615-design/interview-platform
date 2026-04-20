const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
         lowercase:true,
    },
    password:{
        type:String,
        required:true,
        minlength:[3,'password must be at least 3 characters long'],
        
    }
})


const user = mongoose.model('user',userSchema)
module.exports=user