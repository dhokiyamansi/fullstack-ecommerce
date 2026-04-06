const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailRegex = /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|[0-9]{9}@daiict\.ac\.in)$/;

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required", success: false });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.status(500).json({ error: "Error hashing password", success: false });
    }

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully", success: true });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid user data", details: err.errors });
    }
    return res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token, userId: user._id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login };