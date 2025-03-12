const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const router = express.Router()

{/*
// Register Route
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
*/}
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if all required fields are present
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required",success:false });
        }

        // 2. Validate email format (basic regex check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format",success:false });
        }

        // 3. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists",success:false });
        }

        // 4. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return res.status(500).json({ error: "Error hashing password",success:false });
        }

        // 5. Create and save the new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully",success:true });

    } catch (err) {
        // Handle Mongoose validation errors
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: "Invalid user data", details: err.errors });
        }
        return res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
});


// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, userId: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports= router;