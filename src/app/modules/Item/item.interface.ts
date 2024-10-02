import { ObjectId } from "mongoose";


export type TItem = {
  title: string;
  images?: string[];
  user: ObjectId;
  comment?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};




export interface IComment {
  userId: string;
  text: string;
  createdAt: Date;
}






