const express = require("express");
const authRoutes = require("./authRouter");
const vehicleRoutes = require("./vehicleRouter");

const router = express.Router();

router.use(authRoutes);
router.use("/vehicles", vehicleRoutes);


module.exports = router;
