import express from 'express';
import authValidator from '@modules/auth/authValidator';
import authController from '@modules/auth/authController';

const authRouter = express.Router();

authRouter.post('/login', authValidator.validateLogin, authController.login);
// 리프레시 토큰 구현화시 다른 서비스들도 실행되면서 프론트들이 고장이나 임시 주석처리 백엔드 완성시 활성화
// authRouter.post('/refresh', authController.refreshToken);
authRouter.post('/logout', authController.logout);

export default authRouter;
