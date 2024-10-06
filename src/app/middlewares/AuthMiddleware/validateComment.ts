import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

export const validateComment = (req: Request, _res: Response, next: NextFunction) => {
    const { comment } = req.body; // Use 'comment' instead of 'content'

    console.log(comment); // Debugging output

    if (!comment || comment.trim().length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Comment content cannot be empty.');
    }

    if (comment.length > 500) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Comment content exceeds the allowed limit of 500 characters.');
    }

    next();
};
