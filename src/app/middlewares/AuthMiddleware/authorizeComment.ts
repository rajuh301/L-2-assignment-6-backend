import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import Comment from '../../modules/comment/comment.model';

export const authorizeComment = async (req: Request, _res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const userId = req.user._id; // Assuming user info is attached to req.user after authentication

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Comment not found.');
    }

    // Check if the logged-in user is the owner of the comment
    if (comment.user.toString() !== userId.toString()) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to modify this comment.');
    }

    next();
};
