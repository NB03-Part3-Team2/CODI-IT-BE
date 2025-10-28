import express from 'express';
import userValidator from '@modules/user/userValidator';
import userController from '@modules/user/userController';
import { authMiddleware } from '@middlewares/authMiddleware';

const userRouter = express.Router();

userRouter.route('/').post(userValidator.validateUserCreate, userController.createUser);
userRouter.route('/me').get(authMiddleware, userController.getUser);

export default userRouter;
