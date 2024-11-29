const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // 使用 SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 使用授权码
    },
});

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: `"Your Name" <${process.env.EMAIL_USER}>`, // 发件人
            to, // 收件人
            subject, // 邮件主题
            text, // 邮件内容
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = { sendEmail };