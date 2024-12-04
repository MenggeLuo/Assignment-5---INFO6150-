const jwt = require("jsonwebtoken");
const temporaryStore = {};

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        console.log("No token provided");
        return res.status(403).json({ error: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        res.status(401).json({ error: "Unauthorized." });
    }
};


module.exports = verifyToken;
