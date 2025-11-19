const transporter = require("./nodeMailer");
const { User } = require("../../models"); // Sequelize model
const emailVerificationTemplate = require("../services/emailTemplate");

// Generate 6-digit verification code
function generateRandomCode() {
  let token = "";
  for (let i = 0; i < 6; i++) {
    token += Math.floor(Math.random() * 10);
  }
  return token;
}

const sendEmailVerificationCode = async (user) => {
  try {
    const code = generateRandomCode();
    const username = user.username;

    // 🔥 Update using Sequelize instead of Prisma
    await User.update(
      { verification_code: code },
      { where: { email: user.email } }
    );

    const mailOptions = {
      from: "topntechofficial@gmail.com",
      to: user.email,
      subject: "Email Verification Code",
      html: emailVerificationTemplate(code, username),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email send error:", error);
      } else {
        console.log("Verification email sent: " + info.response);
      }
    });

  } catch (error) {
    console.error("sendEmailVerificationCode error:", error);
  }
};

module.exports = sendEmailVerificationCode;
