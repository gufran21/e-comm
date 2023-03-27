const nodeMailer=require('nodemailer')
const sendEmail=async(options)=>{
const transporter=nodeMailer.createTransport({
    host:process.env.GMAIL_HOST,

    port:process.env.GMAIL_PORT,
    service:process.env.SMPT_SERVICE,
    auth:{
        user:process.env.SMPT_MAIL,
        pass:process.env.SMPT_PASSWORD
    }
})
const mailOption={
    fro:process.env.SMPT_MAIL,
    to:options.email,
    subject:options.subject,
    text:options.message
}
await transporter.sendMail(mailOption)
}
module.exports=sendEmail