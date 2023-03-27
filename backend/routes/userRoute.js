const express=require('express')
const { ragister, login, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, upadateProfile, getAllUser, getSingleUser, deleteUser, upadateUser } = require("../controler/userControler")
const { authentication, autherizeRole } = require('../middleware/authentication')
const router=express.Router()
router.route("/ragister").post(ragister)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(authentication, getUserDetails)
router.route("/profile/update").put(authentication, upadateProfile)
router.route("/password/update").put(authentication, updatePassword)
router.route("/admin/users").get(authentication,autherizeRole("admin"), getAllUser)
router.route("/admin/users/:id").get(authentication,autherizeRole("admin"), getSingleUser)

router.route("/admin/user/:id").put(authentication,autherizeRole("admin"), upadateUser).delete(authentication,autherizeRole("admin"), deleteUser)

module.exports=router
