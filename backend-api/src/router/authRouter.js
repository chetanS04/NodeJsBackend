const express = require("express");
const validate = require("../middleware/validateInput");

const {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validations/auth.validator");

const {
  login,
  forgotPassword,
  getResetPassword,
  resetpassword,
} = require("../controller/authController");

const router = express.Router();

// CORS headers (optional)
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept, Authorization"
  );
  next();
});

// Routes
router.post("/login", validate(loginSchema), login);

router.post(
  "/user/forgotPassword",
  validate(forgotPasswordSchema),
  forgotPassword
);

router
  .route("/user/reset-password/:token")
  .get(getResetPassword)
  .post(validate(resetPasswordSchema), resetpassword);

module.exports = router;
