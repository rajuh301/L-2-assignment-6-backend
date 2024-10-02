import mongoose from 'mongoose';
import { z } from 'zod';

const createItemValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    
    image: z.string().optional(),
   

    user: z
      .string({
        required_error: 'User is required',
      })
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      }),
  
  }),
});

const updateItemValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    user: z
      .string()
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      })
      .optional(),
    
  }),
});

export const ItemValidation = {
  createItemValidationSchema,
  updateItemValidationSchema,
};
