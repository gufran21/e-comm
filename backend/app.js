const express=require('express')
const product=require("./routes/productroute")
const user=require('./routes/userRoute')
const order=require('./routes/orderRoute')
const errorMiddleware=require('./middleware/error')
const cookieParser =require('cookie-parser')
const app=express()
app.use(express.json())
app.use(cookieParser())
//user route
app.use('/api/v1',product)
app.use("/api/v1",user)
app.use("/api/v1",order)
//middleware
app.use(errorMiddleware)
module.exports=app