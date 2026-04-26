import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import jwt, { type Secret } from "jsonwebtoken";
import { Error as MongooseError } from "mongoose";

import User from "../models/User.ts";

const emailRegex = /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|[0-9]{9}@daiict\.ac\.in)$/;

interface SignupRequestBody {
  username?: string;
  email?: string;
  password?: string;
}

interface LoginRequestBody {
  email?: string;
  password?: string;
}

const getJwtSecret = (): Secret => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env");
  }
  return secret;
};

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Unknown error";

export const signup = async (
  req: Request<ParamsDictionary, unknown, SignupRequestBody>,
  res: Response,
) => {
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
  } catch (err: unknown) {
    if (err instanceof MongooseError.ValidationError) {
      return res.status(400).json({ error: "Invalid user data", details: err.errors });
    }
    return res.status(500).json({ error: "Internal Server Error", message: getErrorMessage(err) });
  }
};

export const login = async (
  req: Request<ParamsDictionary, unknown, LoginRequestBody>,
  res: Response,
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id.toString() }, getJwtSecret(), { expiresIn: "1d" });
    return res.json({ token, userId: user._id });
  } catch (err: unknown) {
    return res.status(500).json({ error: getErrorMessage(err) });
  }
};
