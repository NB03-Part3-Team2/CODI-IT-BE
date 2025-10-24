import express from 'express';
import usersValidator from '@modules/users/usersValidator';
import usersController from '@modules/users/usersController';

const usersRouter = express.Router();

usersRouter.route('/').post(usersValidator.validateUserCreate, usersController.createUser);

export default usersRouter;
