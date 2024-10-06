import express from 'express';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';
import validateImageFileRequest from '../../middlewares/validateImageFileRequest';
import validateRequest from '../../middlewares/validateRequest';
import { ImageFilesArrayZodSchema } from '../../zod/image.validation';
import { ItemControllers } from './item.controller';
import { ItemValidation } from './item.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { authMiddleware } from '../../middlewares/AuthMiddleware/authMiddleware';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.USER),
  multerUpload.fields([{ name: 'itemImages' }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(ItemValidation.createItemValidationSchema),
  ItemControllers.createItem
);

router.get('/', ItemControllers.getAllItems);

router.get('/:id', ItemControllers.getItem);

router.put(
  '/:id',
  auth(USER_ROLE.USER),
  validateRequest(ItemValidation.updateItemValidationSchema),
  ItemControllers.updateItem
);


router.get('/user/posts', auth(USER_ROLE.USER), ItemControllers.getUserPosts);


router.delete('/:id', auth(USER_ROLE.USER), ItemControllers.deleteItem);

router.post('/:itemId/comments', auth(USER_ROLE.USER), ItemControllers.addComment);



// Route to like an item
router.post('/:itemId/like', auth(USER_ROLE.USER), ItemControllers.likeItem);

// Route to dislike an item
router.post('/:itemId/dislike', auth(USER_ROLE.USER), ItemControllers.dislikeItem);


export const ItemRoutes = router;
