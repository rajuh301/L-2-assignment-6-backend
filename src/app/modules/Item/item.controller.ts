import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ItemServices } from './item.service';
import { NextFunction, Request, Response } from 'express';



const createItem = catchAsync(async (req, res) => {
  if (!req.files) {
    throw new AppError(400, 'Please upload an image');
  }

  const item = await ItemServices.createItemIntoDB(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Item created successfully',
    data: item,
  });
});

const getAllItems = catchAsync(async (req, res) => {
  const item = await ItemServices.getAllItemsFromDB(req.query);



  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Item retrieved successfully',
    data: item,
  });
});


const getItem = catchAsync(async (req, res) => {
  const itemId = req.params.id;
  const item = await ItemServices.getItemFromDB(itemId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Item retrieved successfully',
    data: item,
  });
});

const updateItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedItem = await ItemServices.updateItemInDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Item updated successfully',
    data: updatedItem,
  });
});

const deleteItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  await ItemServices.deleteItemFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Item deleted successfully',
    data: null,
  });
});


// -------------- Get post by user ---------------------

const getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id; // Get the logged-in user's ID
    const query = req.query; // Get any additional query parameters for filtering

    // Fetch the items/posts by user
    const items = await ItemServices.getUserItemsFromDB(query, userId);

    if (!items || items.length === 0) {

      throw new Error('Item not found')
    }


    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User posts retrieved successfully',
      data: items,
    });


  } catch (error) {
    return next(new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving user posts.'));
  }
};
// -------------- Get post by user ---------------------



// ------------------- Add comment ------------------

const addComment = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id; // Assuming you have user data from JWT middleware

    const updatedItem = await ItemServices.addCommentToItem(itemId, userId, comment);

    res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ------------------- Add comment ------------------



// ------------------- Like and dislike-------------------
const likeItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id; // Assumes user data is available via authentication middleware

    const updatedItem = await ItemServices.likeItem(itemId, userId);
    res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const dislikeItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const updatedItem = await ItemServices.dislikeItem(itemId, userId);
    res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// ------------------- Like and dislike-------------------




export const ItemControllers = {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem,
  getUserPosts,
  addComment,
  likeItem,
  dislikeItem
};
