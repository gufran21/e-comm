const ErrorHandler=require("../util/errorhandler")
const error=(err,req,resp,next)=>{
    err.statusCode=err.statusCode||500
    err.message=err.message||"internal server error"
    //mongoose invalid id error
    if(err.name==="CastError"){
        const message=`resource not found. invalid ${err.path}`
        err=new ErrorHandler(400,message)
    }
    //mongoose duplicate key error
    if(err.code===11000){
        const message=`duplicate ${Object.keys(err.keyValue)} entered`
        err=new ErrorHandler(400,message)
    }
    //json web token error 
    if(err.name==="JsonWebTokenError"){
        const message=`Json Web token  is invalid, try again`
        err=new ErrorHandler(400,message)
    }
    /// jwt expire error
    if(err.name==="jwtExpireError"){
        const message=`Json Web token  is expire, try again`
        err=new ErrorHandler(400,message)
    }
    resp.status(err.statusCode).json({
        success:false,
        message:err.message
    })

}
module.exports=error