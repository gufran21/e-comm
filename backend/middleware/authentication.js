const ErrorHandler = require("../util/errorhandler");
const asyncErrorHandler = require("./asyncErrorHandler");
const jwt =require("jsonwebtoken");
const User=require('../model/userModel')
exports.authentication=asyncErrorHandler(async(req,resp,next)=>{
    const {token}=req.cookies
    if(!token){
      return next(new ErrorHandler(401,"please login to access this resource"))
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRATE)
    req.user=await User.findById(decodedData.id)
    next()
})
exports.autherizeRole=(...roles)=>{
    return (req,resp,next)=>{
      
        if(!roles.includes(req.user.role)){
           return next(new ErrorHandler(403,`${req.user.role} is not allowed to access this resource`))
        }
        next()
    }
}