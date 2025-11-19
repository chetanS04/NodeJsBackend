const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: "topntechofficial@gmail.com",
    pass: "ypbr tbyj giow uqds",
  },
});

module.exports = transporter;