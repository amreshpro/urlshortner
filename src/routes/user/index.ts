import express from "express";
import UserController from "../../controller/user";

const userRouter = express.Router();

// Create user route
userRouter.post("/", UserController.createUser);

// Get all users route
userRouter.get("/", UserController.getAllUsers);

// Get single user by ID route
userRouter.get("/:id", UserController.getUserById);

// Update user by ID route
userRouter.put("/:id", UserController.updateUser);

// Delete user by ID route
userRouter.delete("/:id", UserController.deleteUser);

export default userRouter;
