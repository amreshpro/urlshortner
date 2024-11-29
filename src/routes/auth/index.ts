import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import validateUserData from "../../utils/validations/user";
import AuthController from "../../controller/auth";

const authRouter = express.Router();

// User Registration Route
authRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user data
      const isValid = validateUserData(req.body);
      if (!isValid) {
        throw createError(400, "Invalid user data");
      }

      await AuthController.signup(req, res, next);
    } catch (error) {
      next(error);
    }
  },
);

// User Login Route
authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Validate email and password
      if (!email || !password) {
        throw createError(400, "Email and password are required");
      }
      return await AuthController.login(req, res, next);
    } catch (error) {
      next(error);
    }
  },
);

export default authRouter;
