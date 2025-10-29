import express from 'express';
import storeController from '@modules/store/storeController';
import storeValidator from '@modules/store/storeValidator';
import { authMiddleware } from '@middlewares/authMiddleware';
const storeRouter = express.Router();

storeRouter
  .route('/')
  .post(authMiddleware, storeValidator.validateCreateStore, storeController.postStore);

storeRouter
  .route('/detail/my/product')
  .get(authMiddleware, storeValidator.validateGetMyProductList, storeController.getMyProductList);

storeRouter.route('/detail/my').get(authMiddleware, storeController.getMyStore);

storeRouter
  .route('/:storeId')
  .get(storeValidator.validateGetStore, storeController.getStore)
  .patch(authMiddleware, storeValidator.validateUpdateStore, storeController.patchStore);

export default storeRouter;
