import express from 'express';
import multer from 'multer';
import productController from '@modules/product/productController';
import productValidator from '@modules/product/productValidator';
import { authMiddleware } from '@middlewares/authMiddleware';
import { uploadSingleImage } from '@middlewares/s3Middleware';

const productRouter = express.Router();

productRouter
  .route('/')
  .post(
    authMiddleware,
    uploadSingleImage,
    productValidator.validateCreateProduct,
    productController.postProduct,
  );

export default productRouter;
