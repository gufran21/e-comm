const  express=require('express')
const { getProduct ,createProduct,updateProduct,deleteProduct,getProductDetails, createProductReview, getProductReviews, deleteReview} = require('../controler/productcontroler')
const {authentication, autherizeRole}= require('../middleware/authentication')

const router=express.Router()


// get all product route
router.route('/products').get( getProduct)
// create product route
router.route('/product/new').post(authentication,autherizeRole("admin"),createProduct)
//update product  route
router.route('/product/:id').put(authentication,autherizeRole("admin"),updateProduct)
//delete product route
router.route('/product/:id').delete(authentication,autherizeRole("admin"),deleteProduct)
router.route('/product/:id').get(getProductDetails)
router.route('/review').put(authentication,createProductReview)
router.route('/reviews').get(getProductReviews).delete(authentication,deleteReview)


module.exports=router