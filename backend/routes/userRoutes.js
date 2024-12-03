const express = require("express");
const { register, login, checkEmail,saveEmailAndSendCode, verifyCode  } = require("../controllers/userController");
const router = express.Router();
const verifyToken = require("../services/authService");

router.post("/register", register);
router.post("/login", login);
// router.post("/check-email", checkEmail);
router.get("/home", verifyToken, (req, res) => {
    res.status(200).json({ message: "Welcome to the Home page!", user: req.user });
});

router.post("/save-email", saveEmailAndSendCode);
router.post("/verify-code", verifyCode);

module.exports = router;
