const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.registerUser(email, password);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        if (error.message.includes("already registered")) {
            return res.status(409).json({ error: error.message }); // HTTP 409 indicates conflict
        }
        res.status(400).json({ error: error.message });
    }
};

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

module.exports = { register, login, checkEmail };
