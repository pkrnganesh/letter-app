const express = require("express");
const { saveLetter } = require("../controllers/letterController");
const { verifyToken } = require("../middleware/authMiddleware");
const { getLetters } = require("../controllers/letterController");

const router = express.Router();

router.post("/save", verifyToken, saveLetter);
router.get("/list", verifyToken, getLetters);


module.exports = router;
