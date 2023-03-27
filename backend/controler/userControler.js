const asyncErrorHandler = require("../middleware/asyncErrorHandler")
const User=require("../model/userModel");
const ErrorHandler = require("../util/errorhandler");
const {generateToken} =require("../util/generateToken")
const senEmail=require("../util/sendEmail")
const crypto =require("crypto");

exports.ragister=asyncErrorHandler( async(req,resp,next)=>{
   
       const{name,email,password}=req.body
       const user =await User.create({
        name,email,password,
        image:{
            public_id:"image id",
            url:"image url"
        }
       });
       generateToken(user,201,resp)
})
exports.login=asyncErrorHandler(async(req,resp,next)=>{
    const {email,password}=req.body
    if(!email||!password){
        return next(new ErrorHandler(400,"please enter email and password"))
    }
    const user=await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler(401,"invalid email  or password"))
    }
   
    const ismatchedpassword=await user.comparePassword(password)
   
    if(!ismatchedpassword){
        return next(new ErrorHandler(401,"invalid email  or password"))
    }
    generateToken(user,200,resp)
})
exports.logout=asyncErrorHandler(async(req,resp,next)=>{
      resp.cookie("token",null,{expires:new Date(Date.now()),httpOnly:true})
      resp.status(200).json({
        success:true,
         message:"logged out successfully" 
     })
})
exports.forgotPassword=asyncErrorHandler(async(req,resp,next)=>{
   const user=await User.findOne({email:req.body.email})
   if(!user){
    return next(new ErrorHandler(404,"user not found"))
   }
   console.log(user)
   const resetToken=user.getResetPassswordToken()
   await user.save({validateBeforeSave:false}) 
   const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/${resetToken}`
   const message=`You're receiving this e-mail because you or someone else has requested a password reset for your user account at .\n\n Click the link below to reset your password:\n ${resetPasswordUrl}\n\n If you did not request a password reset you can safely ignore this email.`
    try{
        await senEmail({
            email:user.email,
            subject:`saaj Password recovery`,
            message
        })
        resp.status(200).json({
            success:true,
            message:`mail has been sent to ${user.email} successfully`
        })

    }
    catch(err){
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(500,err.message))
    }
})
exports.resetPassword=asyncErrorHandler(async(req,resp,next)=>{
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex")
    console.log(resetPasswordToken)
    let user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new ErrorHandler(400,"reset password token is invalid or has been expired"))
    }
    console.log(user)
    if(req.body.password!=req.body.confirmPassword){
        return next(new ErrorHandler(400,"password does not matched"))
    }
    user.password=req.body.password,
    user.resetPasswordToken=undefined,
    user.resetPasswordExpire=undefined
    await user.save()
    generateToken(user,200,resp)

})

//get user details
exports.getUserDetails=asyncErrorHandler(async(req,resp,next)=>{
    const user=await User.findById(req.user.id)
    resp.status(200).json({
        success:true,
    user
    })
})
exports.updatePassword=asyncErrorHandler(async(req,resp,next)=>{
    const user=await User.findById(req.user.id).select("+password")
    const ismatchedpassword=user.comparePassword(req.body.oldPassword)
    if(!ismatchedpassword){
        return next(new ErrorHandler(400,"old password is incorrect"))
    }
    if(req.body.newPassword!=req.body.newConfirmPassword){
        return next(new ErrorHandler(400,"password does not matched"))
    }
    user.password=req.body.newPassword
    await user.save()
    generateToken(user,200,resp)
})
exports.upadateProfile=asyncErrorHandler(async(req,resp,next)=>{
    const newUser={
   name:req.body.name,
   email:req.body.email
   }
        const user=await User.findByIdAndUpdate(req.user.id,newUser,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })
        resp.status(200).json({
            success:true,
            user
        })
})
//GET ALL USER DETAILS --admin
exports.getAllUser=asyncErrorHandler(async(req,resp,next)=>{
    const users=await User.find()
    const usersCount=await User.countDocuments()
    resp.status(200).json({
        success:true,
        users,
        usersCount,
    })
})
//GET SINGLE USER DETAILS --admin
exports.getSingleUser=asyncErrorHandler(async(req,resp,next)=>{
    const user=await User.findById(req.params.id)
 
    if(!user){
    return next(new ErrorHandler(404,"user not found"))
    }
    resp.status(200).json({
        success:true,
        user,
    
    })
})
//update roll
exports.upadateUser=asyncErrorHandler(async(req,resp,next)=>{
   const newUser={
   name:req.body.name,
   email:req.body.email,
   role:req.body.role
   }
   let user=await User.findById(req.params.id)
   if(!user){
      return next(new ErrorHandler(404,`uesr does not exist wit id ${req.params.id}`))
   }
   user=await User.findByIdAndUpdate(req.params.id,newUser,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })
        resp.status(200).json({
            success:true,
            user
        })
})

//delete user
exports.deleteUser=asyncErrorHandler(async(req,resp,next)=>{
   
         const user=await User.findById(req.params.id)
         if(!user){
            return next(new ErrorHandler(404,`uesr does not exist wit id ${req.params.id}`))
         }
        await user.deleteOne()
        resp.status(200).json({
             success:true
         })
 })
 