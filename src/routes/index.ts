import { Router } from 'express';
import storeRouter from '@modules/store/storeRoute';
/*
	modules에서 route임포트
	import sampleRoutes from '@modules/sample/sampleRoute';
*/
const router = Router();

/*
	Router 등록
	rotuer.use('/sample', sampleRoutes);
*/
router.use('/stores', storeRouter);

export default router;
