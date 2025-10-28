import express from 'express';
import storeController from '@modules/store/storeController';
import storeValidator from '@modules/store/storeValidator';
const storeRouter = express.Router();

storeRouter.route('/').post(storeValidator.validateCreateStore, storeController.postStore); // post: 새 스토어 등록 - 추후 인증 미들웨어 필요

storeRouter
  .route('/detail/my/product')
  .get(storeValidator.validateGetMyProductList, storeController.getMyProductList); // 추후 인증 미들웨어 필요

storeRouter
  .route('/:storeId')
  .get(storeValidator.validateGetStore, storeController.getStore)
  .patch(storeValidator.validateUpdateStore, storeController.patchStore); // // 추후 인증 미들웨어 필요

export default storeRouter;
