import mongoose, { Schema, model } from 'mongoose';
import { TItem, IComment } from './item.interface';

// Define the comment schema
const commentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Automatically set the timestamp
});

// Define the item schema, including comments
const itemSchema = new Schema<TItem>(
  {
    title: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: {
      type: [commentSchema],
      default: [],
    },

    // New like and dislike fields
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

// Export the Item model
export const Item = model<TItem>('Item', itemSchema);
