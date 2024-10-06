import mongoose, { ObjectId } from "mongoose";
import { Types } from "mongoose";


export type TItem = {
  title: string;
  images?: string[];
  user: mongoose.Schema.Types.ObjectId;
  comments: IComment[];
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
};



export interface IComment {
  user: mongoose.Schema.Types.ObjectId;
  comment: string;
  createdAt: Date;
}



