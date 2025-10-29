import express from 'express';
import cartController from '@modules/cart/cartController';
import { authMiddleware } from '@middlewares/authMiddleware';

const cartRouter = express.Router();

// POST /api/cart - 장바구니 생성 또는 조회 (인증 필요)
// GET /api/cart - 장바구니 조회 (인증 필요)
cartRouter
  .route('/')
  .post(authMiddleware, cartController.postCart)
  .get(authMiddleware, cartController.getCart);

export default cartRouter;
