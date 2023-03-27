const express=require('express')
const { newOrder, getSingleOrder, myOrder, getallProduct, updateProductStatus, deleteOrder } = require('../controler/ordercontroler')

const {authentication, autherizeRole} =require('../middleware/authentication')
const router=express.Router()
router.route('/admin/order/new').post(authentication,newOrder)
router.route('/admin/order/:id').get(authentication,autherizeRole("admin"),getSingleOrder)
router.route('/orders').get(authentication,myOrder)
router.route('/admin/orders').get(authentication,autherizeRole("admin"),getallProduct)
router.route('/admin/order/status/:id').put(authentication,autherizeRole("admin"),updateProductStatus)
router.route('/admin/order/delete/:id').delete(authentication,autherizeRole("admin"),deleteOrder)
module.exports=router