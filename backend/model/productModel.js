const mongoose = require("mongoose");
const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter the product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "please enter the description"],
  },
  price: {
    type: Number,
    required: [true, "please enter the price"],
    maxLength: [8, "price should be less than 8 figures"],
  },
  ratings:{
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      
    }
  ],
  category:{
    type:String,
    required:[true, "please enter the category"]
  },
  stock:{
    type:Number,
    required:[true, "please enter the stock"],
    maxLength:[4,"stock can not exceed than four figures"],
    default:1
  },
  noOfReviews:{
    type:Number,
    default:0
  },
  reviews:[{
    user:{
      type:mongoose.Schema.ObjectId,
      ref:"User",
      required:true
    },
    name:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
      type:String,
      required:true
    }

  }],
  createdAt:{
    type:Date,
    default:Date.now
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
  }
});
module.exports=mongoose.model("products",productsSchema)
