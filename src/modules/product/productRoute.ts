import express from 'express';
import multer from 'multer';
import productController from '@modules/product/productController';
import productValidator from '@modules/product/productValidator';
import { authMiddleware } from '@middlewares/authMiddleware';

const productRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

productRouter.route('/').post(
  authMiddleware,
  upload.single('image'), // 'image'라는 이름의 필드로 들어오는 파일을 처리
  productValidator.validateCreateProduct,
  productController.postProduct,
);

export default productRouter;
