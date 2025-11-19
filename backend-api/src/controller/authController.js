"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, PasswordResetToken } = require("../../models");
const config = require("../../config/authConfigSecret");
const sendForgetPasswordToken = require("../../src/services/emailService");


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      config.secret,
      { expiresIn: "24h" }
    );

    res.setHeader("Authorization", `Bearer ${token}`);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        message: "User not found! Please enter a valid email address.",
      });
    }

    const existing = await PasswordResetToken.findOne({ where: { email } });

    if (existing && existing.expiry > new Date()) {
      return res.status(400).json({
        message: "Reset link already sent! Please check your email.",
      });
    }

    await sendForgetPasswordToken(email);

    return res.status(200).json({
      message: "Reset password link has been sent to your email address",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};


const getResetPassword = async (req, res) => {
  const { token } = req.params;

  try {
    const resetRecord = await PasswordResetToken.findOne({
      where: { token },
    });

    if (!resetRecord || resetRecord.expiry < new Date()) {
      return res.status(404).json({
        message: "Invalid or expired token!",
      });
    }

    return res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};


const resetpassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    const resetRecord = await PasswordResetToken.findOne({
      where: { token },
    });

    if (!resetRecord || resetRecord.expiry < new Date()) {
      return res.status(400).json({
        message: "Invalid or expired token!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update(
      { password: hashedPassword },
      { where: { email: resetRecord.email } }
    );

    await PasswordResetToken.destroy({
      where: { token },
    });

    return res.status(200).json({
      message: "Password updated successfully! Please login.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

module.exports = {
  login,
  forgotPassword,
  getResetPassword,
  resetpassword,
};
