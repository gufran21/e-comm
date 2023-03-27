const mongoose=require("mongoose")
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")
const crypto=require("crypto")
const userSchema=new mongoose.Schema({
       name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[20,"name must have less than 20 character"],
        minLength:[4,"name must have atleast 4 character"]
       },
       email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter valid email"]
       },
       password:{
        type:String,
        required:[true,"please enter your password"],
        minLength:[8,"name must have atleast 8 character"],
        select:false
       },
       image:
        {
            public_id: {
              type: String,
              required: true,
            },
            url: {
              type: String,
              required: true,
            },
          },
          role:{
            type:String,
            default:"user"
          },
          resetPasswordToken:String,
          resetPasswordExpire:Date
          
})
userSchema.pre("save",async function (next)
{
    if(!this.isModified("password")){
    next()
    }
    this.password=await bcrypt.hash(this.password,10)
    
})
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRATE,{expiresIn: process.env.JWT_EXPIRE})
}
userSchema.methods.comparePassword=async function(enteredPassword){
   return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.methods.getResetPassswordToken=function(){
  const resetToken=crypto.randomBytes(10).toString("hex")
  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")
  this.resetPasswordExpire=Date.now()+15*60*1000
  return resetToken
}
module.exports=mongoose.model("User",userSchema)