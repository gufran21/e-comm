//generating token and saving cookies
exports.generateToken=(user,statusCode,resp)=>{
    const token=user.getJWTToken()
    const options={
        expires:new Date(Date.now()+ process.env.COOKIE_EXPIRE * 24 * 60 * 60 *1000),
        httpOnly:true
    }
    resp.status(statusCode).cookie("token",token,options).json({
        success:true,
        token,
        user
    })
}