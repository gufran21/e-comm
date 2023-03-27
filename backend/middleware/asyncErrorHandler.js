const asyncErrorHandler=(thefunc)=>(req,resp,next)=>{
Promise.resolve(thefunc(req,resp,next)).catch(next)
}
module.exports=asyncErrorHandler