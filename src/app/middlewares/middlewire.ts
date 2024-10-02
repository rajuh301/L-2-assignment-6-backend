// middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../modules/User/user.model'; // Adjust the import path according to your project structure

dotenv.config();

// Define the TUser interface representing the user data
export interface TUser {
  _id: string;          // Unique identifier for the user
  name: string;        // User's name
  email: string;       // User's email address
  role: string;        // User's role (e.g., USER, ADMIN)
  status: string;      // User's status (e.g., ACTIVE, INACTIVE)
  mobileNumber: string; // User's mobile number
  profilePhoto?: string; // Optional profile photo URL
  createdAt?: Date;    // Optional creation date
  updatedAt?: Date;    // Optional last update date
}

// Define the AuthRequest interface extending Express's Request
export interface AuthRequest extends Request {
  user: TUser; // This will hold the authenticated user's information
}

// Auth middleware function to protect routes
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader) {
    token = authHeader.split(' ')[1]; // Assuming Bearer token format
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'You are unauthorized',
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error: JWT secret is not defined',
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to access this application',
      });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found !!',
      });
    }

    // Cast the user to TUser type and assign to req.user
    req.user = user.toObject() as TUser; // Ensure user is casted to TUser
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'You are not authorized to access this application',
    });
  }
};
