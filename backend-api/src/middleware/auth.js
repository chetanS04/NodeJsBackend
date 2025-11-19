const jwt = require("jsonwebtoken");
const config = require("../../config/authConfigSecret");
const { User } = require("../../models"); // <-- Sequelize models

// ==========================
// SIMPLE TOKEN VERIFICATION
// ==========================
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, config.secret, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired token." });
    }

    req.user = user; // decoded token data
    next();
  });
};

// ==========================
// CHECK USER EXISTS IN DB
// ==========================
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided!" });
    }

    const decoded = jwt.verify(token, config.secret);

    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid token" });
    }

    // 🔥 Sequelize instead of Prisma
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: ["id", "role"],  // same as select in Prisma
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    req.user = user; // store db user
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  authenticateToken,
  authenticateUser,
};
