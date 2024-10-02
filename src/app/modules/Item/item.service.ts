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
    Item.find().populate('user'),
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


// --------------- Get item by User ---------------
;
// --------------- Get item by User ---------------

const updateItemInDB = async (itemId: string, payload: TItem) => {
  const result = await Item.findByIdAndUpdate(itemId, payload, { new: true });
  if (result) {
    await addDocumentToIndex(result, 'items');
  } else {
    throw new Error(`Item with ID ${itemId} not found.`);
  }
  return result;
};

// --------------- Comment -----------

// --------------- Comment -----------

// -------------- Get data by user -----------------
const getUserItemsFromDB = async (query: Record<string, unknown>, userId?: string) => {
  // If userId is provided, filter by user
  if (userId) {
    query.user = userId; // Add user ID to the query
  }

  // Create search queries based on the provided filters
  query = (await SearchItemByUserQueryMaker(query)) || query; // If applicable, modify query for user search

  // Date range search
  query = (await SearchItemByDateRangeQueryMaker(query)) || query; // Modify query for date range search

  const itemQuery = new QueryBuilder(
    Item.find().populate('user'), // Ensure to populate user data
    query
  )
    .filter() // Apply additional filters if needed
    .sort() // Sort based on query parameters
    .paginate() // Handle pagination
    .fields(); // Select specific fields if needed

  const result = await itemQuery.modelQuery; // Execute the built query

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

export const ItemServices = {
  createItemIntoDB,
  getAllItemsFromDB,
  getItemFromDB,
  updateItemInDB,
  deleteItemFromDB,
  getUserItemsFromDB

};
