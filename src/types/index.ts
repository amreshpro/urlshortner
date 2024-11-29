import { Request } from "express";

// User roles enumeration
export enum UserRole {
  Admin = "admin",
  User = "user",
}

// User interface with ID and role
export interface User {
  id: string;
  role: UserRole;
}

// AuthRequest interface extending the base Request with a user property
export interface AuthRequest extends Request {
  user?: User; // User property added to request
}

// CreatePostRequest interface, extending AuthRequest
export interface CreatePostRequest extends AuthRequest {
  body: {
    title: string;
    content: string;
    imageUrl?: string; // Optional field
    user: string;
  };
}

// UpdatePostRequest interface, extending AuthRequest
export interface UpdatePostRequest extends AuthRequest {
  params: {
    postId: string; // Post ID to be updated
  };
  body: {
    title?: string; // Title is optional for update
    content?: string; // Content is optional for update
    imageUrl?: string; // Image URL is optional for update
  };
}

// DeletePostRequest interface, extending AuthRequest
export interface DeletePostRequest extends AuthRequest {
  params: {
    postId: string; // The ID of the post to be deleted
  };
}

// CreateUserRequest interface for user creation
export interface CreateUserRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    age?: number; // Age is optional
    city: string;
    country: string;
  };
}
