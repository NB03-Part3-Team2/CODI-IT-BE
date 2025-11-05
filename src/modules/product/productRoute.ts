import express from 'express';
import productController from '@modules/product/productController';
import productValidator from '@modules/product/productValidator';
import reviewController from '@modules/review/reviewController';
import reviewValidator from '@modules/review/reviewValidator';
import { authMiddleware } from '@middlewares/authMiddleware';
import { uploadSingleImage } from '@middlewares/s3Middleware';

const productRouter = express.Router();

productRouter
  .route('/')
  .get(productValidator.validateGetProductList, productController.getProductList)
  .post(
    authMiddleware,
    uploadSingleImage,
    productValidator.validateCreateProduct,
    productController.postProduct,
  );

productRouter
  .route('/:productId/reviews')
  .post(authMiddleware, reviewValidator.validateCreateReview, reviewController.createReview);

export default productRouter;
