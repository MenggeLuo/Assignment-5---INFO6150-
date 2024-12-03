const User = require("../models/user");
const bcrypt = require("bcrypt");

const registerUser = async (email, password) => {
    // Check whether a user with the same mailbox already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("This email is already registered. Please use another email.");
    }

    // Create a new user
    const user = new User({ email, password });
    await user.save();
    return user;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    return user;
};


const checkEmailExists = async (email) => {
    const existingUser = await User.findOne({ email });
    return !!existingUser; // Returns a Boolean value
};

module.exports = { registerUser, loginUser, checkEmailExists };
