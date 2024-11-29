import createError from "http-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import validateUserData from "../../utils/validations/user";
import User from "../../model/user";
import EnvConfig from "../../config/EnvConfig";

export default class AuthController {
  // User signup
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, age, city, country } = req.body;

      // Validate user data
      const user = { name, email, password, age, city, country };
      const isUserVerified = validateUserData(user);
      if (!isUserVerified) {
        throw createError(400, "Invalid user data.");
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw createError(400, "User already exists.");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        age,
        city,
        country,
      });
      await newUser.save();

      res.status(201).json({
        message: "User successfully created.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          age: newUser.age,
          city: newUser.city,
          country: newUser.country,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // User login
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw createError(401, "Invalid email or password.");
      }

      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw createError(401, "Invalid email or password.");
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        EnvConfig.JWT_SECRET!,
        {
          expiresIn: "1h",
        },
      );

      res.status(200).json({
        message: "Login Successful.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          city: user.city,
          country: user.country,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
