import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { verifyToken } from '../../utils/verifyJWT';
import config from '../../config';

export const authMiddleware = (req:Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You must be logged in to comment.');
  }

  try {
    const decoded = verifyToken(token, config.jwt_access_secret as string);
    req.user = decoded; // Attach the user info to the request object
    next();
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token, please login again.');
  }
};
