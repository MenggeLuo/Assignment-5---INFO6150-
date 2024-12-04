const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../services/emailService");

const tempStorage = {};

const User = require('../models/user');



const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }
        const user = await userService.loginUser(email, password);

        // Generate tokens using JWT signatures
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username }, // payload
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

        // Check whether the mailbox already exists
        const exists = await userService.checkEmailExists(email);
        if (exists) {
            return res.status(409).json({ error: "This email is already registered." });
        }

        // Generate the verification code and store it
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        tempStorage[email] = { code, timestamp: Date.now() };

        // Send the verification code email
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

        // The temporary storage is cleared to generate a temporary token
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

        // Verify temporary token
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        const email = decoded.email;

        // Generate a default username from the email
        let username = email.split("@")[0];

        // Ensure username is unique
        let isUnique = await userService.isUsernameUnique(username);
        while (!isUnique) {
            username = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
            isUnique = await userService.isUsernameUnique(username);
        }

        // Register the user with the generated username
        const user = await userService.registerUser(email, password, username);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ error: "Error registering user. Please try again later." });
    }
};

const deleteUserByEmail = async (req, res) => {
    try {
        const { email } = req.body; // 从请求体中获取邮箱

        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        console.error("Error deleting user by email:", error);
        res.status(500).json({ error: "Error deleting user. Please try again later." });
    }
};




module.exports = { saveEmailAndSendCode, verifyCode, register, login, checkEmail, deleteUserByEmail };

