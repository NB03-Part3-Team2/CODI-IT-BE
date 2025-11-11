import { Router } from 'express';
import productRouter from '@modules/product/productRoute';
import storeRouter from '@modules/store/storeRoute';
import userRouter from '@modules/user/userRoute';
import s3Router from '@modules/s3/s3Route';
import authRouter from '@modules/auth/authRoute';
import cartRouter from '@modules/cart/cartRoute';
import orderRouter from '@modules/order/orderRoute';
import reviewRouter from '@modules/review/reviewRoute';

/*
	modules에서 route임포트
	import sampleRoutes from '@modules/sample/sampleRoute';
*/
const router = Router();

/*
	Router 등록
	router.use('/sample', sampleRoutes);
*/
router.use('/products', productRouter);
router.use('/stores', storeRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/s3', s3Router);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);
router.use('/reviews', reviewRouter);

export default router;
