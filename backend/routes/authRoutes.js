const express = require("express");
const {
  googleAuth,
  googleDriveCallback,
  googleDriveAuth,
} = require("../controllers/authController");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Inline middleware to extract token from query param
const verifyTokenFromQuery = (req, res, next) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

router.post("/", googleAuth);
router.get("/init", verifyTokenFromQuery, googleDriveAuth);
router.get("/callback", googleDriveCallback);

module.exports = router;
