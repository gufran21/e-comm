const app=require("./app")
const dotenv=require("dotenv")

const database=require("./config/db")
dotenv.config({path:"backend/config/config.env"})
process.on("uncaughtException",(err)=>{
    console.log(err.message)
    console.log("shuting down server due to uncaught exception")
    process.exit(1)
})
database()
const server=app.listen(process.env.PORT,()=>{
console.log(`server is working ${process.env.PORT}`)
})
//unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`error:${err.message}`),
    console.log("shuting down server due to unhnadle promise rejection")
     server.close(()=>{
        process.exit(1);
     })
})