const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../services/emailService");

const tempStorage = {};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }
        const user = await userService.loginUser(email, password);

        // Generate tokens using JWT signatures
        const token = jwt.sign(
            { id: user._id, email: user.email }, // payload
            process.env.JWT_SECRET, // secret key
            { expiresIn: "1h" } // expiration time
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const exists = await userService.checkEmailExists(email);
        if (exists) {
            return res.status(409).json({ error: "This email is already registered." });
        }
        res.status(200).json({ message: "Email is available." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const saveEmailAndSendCode = async (req, res) => {
    try {
        const { email } = req.body;

        // 检查邮箱是否已存在
        const exists = await userService.checkEmailExists(email);
        if (exists) {
            return res.status(409).json({ error: "This email is already registered." });
        }

        // 生成验证码并存储
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        tempStorage[email] = { code, timestamp: Date.now() };

        // 发送验证码邮件
        await sendEmail(email, code);

        res.status(200).json({ message: "Verification code sent to email." });
    } catch (error) {
        console.error("Error in saveEmailAndSendCode:", error);
        res.status(500).json({ error: "Error sending verification code. Please try again later." });
    }
};

const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const storedData = tempStorage[email];
        if (!storedData) {
            return res.status(400).json({ error: "No verification code found for this email." });
        }

        const isValid = storedData.code === code;
        if (!isValid) {
            return res.status(400).json({ error: "Invalid verification code." });
        }

        // 清除临时存储，生成临时token
        delete tempStorage[email];
        const tempToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.status(200).json({ message: "Code verified successfully.", tempToken });
    } catch (error) {
        console.error("Error in verifyCode:", error);
        res.status(500).json({ error: "Error verifying code. Please try again later." });
    }
};

const register = async (req, res) => {
    try {
        const { tempToken, password } = req.body;

        // 验证临时token
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        const email = decoded.email;

        // 注册用户
        const user = await userService.registerUser(email, password);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ error: "Error registering user. Please try again later." });
    }
};

module.exports = { saveEmailAndSendCode, verifyCode, register, login, checkEmail };

