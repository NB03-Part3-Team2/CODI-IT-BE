import { Router } from 'express';
import usersRouter from '@modules/users/usersRouter';

/*
	modules에서 route임포트
	import sampleRoutes from '@modules/sample/sampleRoute';
*/
const router = Router();

/*
	Router 등록
	router.use('/sample', sampleRoutes);
*/
router.use('/users', usersRouter);

export default router;
