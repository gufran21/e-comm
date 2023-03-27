const { json } = require("express");
const Product = require("../model/productModel");
const ErrorHandler = require("../util/errorhandler");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ApiFeature = require("../util/ApiFeature");
//create product model-- only admin
exports.createProduct = asyncErrorHandler(async (req, resp) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  resp.status(201).json({
    success: true,
    product,
  });
});
//get all product model
exports.getProduct = asyncErrorHandler(async (req, resp,next) => {
  const productPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apifeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(productPerPage);
  const products = await apifeature.query;
  resp.status(200).json({ success: true, products, productsCount });
});
//update product model --admin only
exports.updateProduct = asyncErrorHandler(async (req, resp, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(404, "product not found"));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  resp.status(200).json({
    success: true,
    product,
  });
});
//delete product model --admin only

exports.deleteProduct = asyncErrorHandler(async (req, resp, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(404, "product not found"));
  }
  await Product.findByIdAndRemove(req.params.id);
  resp.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});
//get detail of product

exports.getProductDetails = asyncErrorHandler(async (req, resp, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler(404, "product not found"));
  }
  resp.status(200).json({
    success: true,
    product,
  });
});
//rating and review
exports.createProductReview = asyncErrorHandler (async (req, resp, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => String(rev.user) === String(req.user._id)
  );
  
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (String(rev.user) === String(req.user._id))
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.noOfReviews = product.reviews.length;
  }

  let totalRatings = 0;

  product.reviews.forEach((rev) => {
    totalRatings += rev.rating;
  });

  product.ratings = totalRatings / product.noOfReviews;

  await product.save({ validateBeforeSave: false });

  resp.status(200).json({
    success: true,
  });
});
exports.getProductReviews=asyncErrorHandler(async(req,resp,next)=>{
     const product=await Product.findById(req.query.productId)
     if(!product){
      return next(new ErrorHandler(404,"product not found"))
     }
     resp.status(200).json({
      success:true,
      reviews:product.reviews
     })
})
exports.deleteReview=asyncErrorHandler(async(req,resp,next)=>{
  const product=await Product.findById(req.query.productId)
  if(!product){
    return next(new ErrorHandler(404,"product not found"))
   }
   console.log(product)
  const reviews=product.reviews.filter((rev)=>{
    String(rev._id)!=String(req.query.id)
  })
  console.log(reviews)
  const noOfReviews=reviews.length
  
  let totalRatings = 0;

  reviews.forEach((rev) => {
    totalRatings += rev.rating;
  });
  console.log(totalRatings)
 
  let ratings=0;
  if(noOfReviews){
    ratings=totalRatings/noOfReviews
  }
 
  await Product.findByIdAndUpdate(req.query.productId,{reviews,ratings,noOfReviews},{new:true,runValidators:true,useFindAndModify:false})
  resp.status(200).json({
    success:true,
    
  })
})
