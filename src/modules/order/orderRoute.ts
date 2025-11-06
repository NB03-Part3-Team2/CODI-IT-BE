import express from 'express';
import orderController from '@modules/order/orderController';
import orderValidator from '@modules/order/orderValidator';
import { authMiddleware } from '@middlewares/authMiddleware';

const orderRouter = express.Router();

// POST /api/orders - 주문 생성 (인증 필요)
orderRouter
  .route('/')
  .post(authMiddleware, orderValidator.validateCreateOrder, orderController.createOrder);

export default orderRouter;
