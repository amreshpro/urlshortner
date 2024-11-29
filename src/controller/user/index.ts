import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../model/user";
import validateUserData from "../../utils/validations/user";

export default class UserController {
  // Create a new user
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, age, city, country } = req.body;

      // Validate user data
      const userData = { name, email, password, age, city, country };
      const isUserVerified = validateUserData(userData);
      if (!isUserVerified) {
        throw createError(400, "Invalid user data.");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword, // Store the hashed password
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

  // Retrieve all users
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find().select("-password"); // Exclude password from the response
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  // Retrieve a single user by ID
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // Get user ID from URL parameters
      const user = await User.findById(id).select("-password");

      if (!user) {
        throw createError(404, "User not found.");
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  // Update a user by ID
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email, password, age, city, country } = req.body;

      // Validate user data
      const userData = { name, email, password, age, city, country };
      const isUserVerified = validateUserData(userData);
      if (!isUserVerified) {
        throw createError(400, "Invalid user data.");
      }

      // Hash the new password if provided
      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          name,
          email,
          password: hashedPassword,
          age,
          city,
          country,
        },
        { new: true },
      ).select("-password");

      if (!updatedUser) {
        throw createError(404, "User not found.");
      }

      res.status(200).json({
        message: "User updated successfully.",
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a user by ID
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        throw createError(404, "User not found.");
      }

      res.status(200).json({
        message: "User deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}
