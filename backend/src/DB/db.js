const mongoose = require('mongoose')

function connect(){
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("connected to database")
    })
}

module.exports = connect