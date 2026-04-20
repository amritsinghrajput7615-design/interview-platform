const jwt = require('jsonwebtoken')

const authmiddleware = async(req,res,next)=>{
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]

if(!token){
   return res.status(400).json({ message: "no token" })

    }
    const decoded =  jwt.verify(token,process.env.JWT_SECRET)
    req.user = decoded
    next()

}
module.exports = authmiddleware