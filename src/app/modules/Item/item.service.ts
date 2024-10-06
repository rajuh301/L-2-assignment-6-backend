import { Types } from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { TImageFiles } from '../../interfaces/image.interface';
import { addDocumentToIndex, deleteDocumentFromIndex } from '../../utils/meilisearch';
import { IComment, TItem } from './item.interface';
import { Item } from './item.model';
import {
  SearchItemByDateRangeQueryMaker,
  SearchItemByUserQueryMaker,
} from './item.utils';

const createItemIntoDB = async (payload: TItem, images: TImageFiles) => {
  const { itemImages } = images;
  payload.images = itemImages.map((image) => image.path);

  const result = await Item.create(payload);

  await addDocumentToIndex(result, 'items');



  return result;


};

const getAllItemsFromDB = async (query: Record<string, unknown>) => {
  query = (await SearchItemByUserQueryMaker(query)) || query;

  // Date range search
  query = (await SearchItemByDateRangeQueryMaker(query)) || query;

  const itemQuery = new QueryBuilder(
    Item.find().populate('user')
      .populate({
        path: 'comments.user', // Populate user for each comment
        select: 'name email', // Select fields to return
      }),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await itemQuery.modelQuery;

  return result;
};

const getItemFromDB = async (itemId: string) => {
  const result = await Item.findById(itemId)
    .populate('user')
  return result;
};


const updateItemInDB = async (itemId: string, payload: TItem) => {
  const result = await Item.findByIdAndUpdate(itemId, payload, { new: true });
  if (result) {
    await addDocumentToIndex(result, 'items');
  } else {
    throw new Error(`Item with ID ${itemId} not found.`);
  }
  return result;
};

// -------------- Get data by user -----------------
const getUserItemsFromDB = async (query: Record<string, unknown>, userId?: string) => {
  // If userId is provided, filter by user
  if (userId) {
    query.user = userId; // Add user ID to the query
  }


  query = (await SearchItemByUserQueryMaker(query)) || query;

  // Date range search
  query = (await SearchItemByDateRangeQueryMaker(query)) || query;

  const itemQuery = new QueryBuilder(
    Item.find().populate('user'),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await itemQuery.modelQuery;

  return result; // Return the result
};
// -------------- Get data by user -----------------


const deleteItemFromDB = async (itemId: string) => {
  const result = await Item.findByIdAndDelete(itemId);
  const deletedItemId = result?._id;
  if (deletedItemId) {
    await deleteDocumentFromIndex('items', deletedItemId.toString());
  }
  return result;
};



// ---------------------- Add comment --------------
const addCommentToItem = async (itemId: string, userId: string, commentText: string) => {
  const item = await Item.findById(itemId);

  if (!item) {
    throw new Error(`Item with ID ${itemId} not found.`);
  }


  const newComment: IComment = {
    user: userId,
    comment: commentText,
    createdAt: new Date(),
  };

  item.comments.push(newComment);
  await item.save();
  return item; // Return the updated item with comments
};
// ---------------------- Add comment --------------


// --------------- Add like and deslike ---------
const likeItem = async (itemId: string, userId: Types.ObjectId) => {
  const item = await Item.findById(itemId);

  if (!item) {
    throw new Error('Item not found');
  }

  const userIndexInLikes = item.likes.findIndex((like) => like.equals(userId));
  const userIndexInDislikes = item.dislikes.findIndex((dislike) => dislike.equals(userId));

  if (userIndexInLikes === -1) {
    // Add user to likes array and remove from dislikes (if exists)
    item.likes.push(userId);
    if (userIndexInDislikes !== -1) {
      item.dislikes.splice(userIndexInDislikes, 1);
    }
  } else {
    // Remove the like if already liked
    item.likes.splice(userIndexInLikes, 1);
  }

  await item.save();
  return item.populate('user');
};

const dislikeItem = async (itemId: string, userId: Types.ObjectId) => {
  const item = await Item.findById(itemId);

  if (!item) {
    throw new Error('Item not found');
  }

  const userIndexInLikes = item.likes.findIndex((like) => like.equals(userId));
  const userIndexInDislikes = item.dislikes.findIndex((dislike) => dislike.equals(userId));

  if (userIndexInDislikes === -1) {
    // Add user to dislikes array and remove from likes (if exists)
    item.dislikes.push(userId);
    if (userIndexInLikes !== -1) {
      item.likes.splice(userIndexInLikes, 1);
    }
  } else {
    // Remove the dislike if already disliked
    item.dislikes.splice(userIndexInDislikes, 1);
  }

  await item.save();
  return item.populate('user');
};

// --------------- Add like  and deslike---------


export const ItemServices = {
  createItemIntoDB,
  getAllItemsFromDB,
  getItemFromDB,
  updateItemInDB,
  deleteItemFromDB,
  getUserItemsFromDB,
  addCommentToItem,
  likeItem,
  dislikeItem
};
