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

// -------------- Get item by user------------

// -------------- Get item by user------------

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


// --------------- Comment Section ---------------


// --------------- End Comment Section ---------------

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



export const ItemControllers = {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem,
  getUserPosts
};
