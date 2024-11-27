const express = require("express");
const { register, login, checkEmail } = require("../controllers/userController");
const router = express.Router();
const verifyToken = require("../services/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/check-email", checkEmail);
router.get("/home", verifyToken, (req, res) => {
    res.status(200).json({ message: "Welcome to the Home page!", user: req.user });
});

module.exports = router;
