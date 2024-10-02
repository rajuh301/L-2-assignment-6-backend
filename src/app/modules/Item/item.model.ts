import { Schema, model } from 'mongoose';
import { TItem } from './item.interface';

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

    comment: {
      type: [String],
      default: []
    }

  },
  {
    timestamps: true,
    virtuals: true,
  }
);



export const Item = model<TItem>('Item', itemSchema);
