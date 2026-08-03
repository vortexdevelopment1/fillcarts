const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`
  });
}

module.exports = sendEmail;