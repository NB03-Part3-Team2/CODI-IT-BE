import express from 'express';
import authValidator from '@modules/auth/authValidator';
import authController from '@modules/auth/authController';

const authRouter = express.Router();

authRouter.route('/login').post(authValidator.validateLogin, authController.login);

export default authRouter;
