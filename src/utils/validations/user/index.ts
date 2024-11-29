import { z } from "zod";
import { logger } from "../../logging";
import { UserRole } from "../../../types";

// Define Zod schema for User
const userValidationSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password should be at least 6 characters long"),
  age: z.number().optional(), // Age is optional
  city: z.string().min(2, "City should be at least 2 characters long"),
  country: z.string().min(2, "Country should be at least 2 characters long"),
  createdAt: z.date().default(new Date()), // Default to current date
  role: z.enum([UserRole.Admin, UserRole.User]).default(UserRole.User), // Enum for role
});

export default function validateUserData(user: any) {
  const userValidationResult = userValidationSchema.safeParse(user);
  if (!userValidationResult.success) {
    logger.info(userValidationResult.error);
    return false;
  } else {
    logger.info("Valid data", userValidationResult.data);
    return true;
  }
}
