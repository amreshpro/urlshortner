import { NextFunction, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import EnvConfig from "../../config/EnvConfig";
import { AuthRequest, User } from "../../types";

export const authenticateJWT = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is missing or invalid
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        createError(401, "Authorization token is missing or invalid."),
      );
    }

    const token = authHeader.split(" ")[1]; // Extract the token

    // Verify the token and ensure it matches the User type
    jwt.verify(token, EnvConfig.JWT_SECRET!, (err, decodedToken) => {
      if (err) {
        return next(createError(403, "Invalid or expired token"));
      }

      // Typecast decodedToken to User type for type safety
      const user = decodedToken as User;

      // Attach user object to the request

      req.user = user;
      next(); // Proceed to the next middleware/route
    });
  } catch (error) {
    next(error);
  }
};
