import { Router } from 'express';
import storeRouter from '@modules/store/storeRoute';
import usersRouter from '@modules/users/usersRouter';
import authRouter from '@modules/auth/authRouter';

/*
	modules에서 route임포트
	import sampleRoutes from '@modules/sample/sampleRoute';
*/
const router = Router();

/*
	Router 등록
	router.use('/sample', sampleRoutes);
*/
router.use('/stores', storeRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter);

export default router;
