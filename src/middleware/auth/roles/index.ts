import { NextFunction, Response } from "express";
import createError from "http-errors";
import { AuthRequest, UserRole } from "../../../types";
import { logger } from "../../../utils/logging";

export const authorize = (roles: UserRole[] = [UserRole.User]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Check if req.user exists (user must be authenticated)
    if (!req.user) {
      logger.error("user is not authenticated");
      return next(createError(401, "Unauthorized: User not authenticated"));
    }

    const userRole = req.user.role; // Assumes user is authenticated and role exists

    logger.info("userRole", userRole);
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(userRole)) {
      return next(
        createError(
          403,
          "Forbidden: You do not have permission to perform this action.",
        ),
      );
    }

    next(); // Proceed to the next middleware or route handler
  };
};
