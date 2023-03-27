const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const Order = require("../model/orderModel");
const ErrorHandler = require("../util/errorhandler");

const Product=require('../model/productModel');
const { findById } = require("../model/orderModel");
exports.newOrder = asyncErrorHandler(async (req, resp, next) => {
 console.log(req.body)
  const {
    shippingInfo,
    orderedItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    totalPrice
  } = req.body;
  console.log(this.newOrder)
  const order = await Order.create({
    shippingInfo,
    orderedItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id
  });
  if (!order) {
    return next(new ErrorHandler(400, "product is not ordered successfully"));
  }
  resp.status(201).json({
    success: true,
    order
  });
});

exports.myOrder=asyncErrorHandler(async(req,resp,next)=>{
    const order=await Order.find({user:req.user._id})
  
    resp.status(200).json({
        success:true,
        order
    })
})
//admin
exports.getSingleOrder=asyncErrorHandler(async(req,resp,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email")
    console.log(order)
    if(!order){
     return next(new ErrorHandler(404,"order not found with this id"))
    }
    resp.status(200).json({
        success:true,
        order
    })
})
//admin
exports.getallProduct=asyncErrorHandler(async(req,resp,next)=>{
    const orders=await Order.find();
    let totalPrice=0;
    orders.forEach((order)=>{
        totalPrice+=order.totalPrice
    })
    resp.status(200).json({
        success:true,
        orders,
        totalPrice
    })
})
//admin
exports.updateProductStatus=asyncErrorHandler(async(req,resp,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(404,"order not found with this id"))
       }
    
   if(order.orderStatus==="Delivered"){
    return next(new ErrorHandler(400,"order has been already delivered"))
   }
   if(req.body.status==="Shipped"){
    order.orderedItems.forEach(async(ord)=>{
        await updateStock(ord.product,ord.quantity)
    })
   }
   
   order.orderStatus=req.body.status
   if(req.body.status==="Delivered"){
    order.deliveredAt=Date.now()
   }
   await order.save({validateBeforeSave:false})
    resp.status(200).json({
        success:true
    })
    async function updateStock(productId,qauntity){

        const product=await Product.findById(productId)
        product.stock-=qauntity
        await product.save({validateBeforeSave:false})
    }
})
//admin 
exports.deleteOrder=asyncErrorHandler(async(req,resp,next)=>{
       const order=await Order.findById(req.params.id)
    
       if(!order){
        return next(new ErrorHandler(404,"order not found with this id"))
       }
       const result=await Order.deleteOne({_id:req.params.id})
      
       resp.status(200).json({
        success:true
       })
})