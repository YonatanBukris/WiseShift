import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthResponse } from "../types/api";
import { IUser } from "../types/models";

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

export const register = async (
  req: Request,
  res: Response<AuthResponse>
): Promise<void> => {
  try {
    console.log('Received registration request:', req.body);
    const { name, email, password, department, phoneNumber, role = "employee" } = req.body;

    if (!name || !email || !password || !department) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    // Validate role
    if (role !== "manager" && role !== "employee") {
      res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      department,
      phoneNumber,
      role,
      status: {
        physicallyInjured: false,
        spouseAvailable: false,
        availableHours: 0,
        canWorkAsUsual: true,
        lastUpdated: new Date()
      },
      preferences: {
        language: "he",
        notifications: true
      }
    });

    const token = generateToken(user._id);

    console.log('User created successfully:', user);

    res.status(201).json({
      success: true,
      data: user,
      token,
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const login = async (
  req: Request,
  res: Response<AuthResponse>
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}; 