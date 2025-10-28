import express from 'express';
import userValidator from '@modules/user/userValidator';
import userController from '@modules/user/userController';

const userRouter = express.Router();

userRouter.route('/').post(userValidator.validateUserCreate, userController.createUser);

export default userRouter;
