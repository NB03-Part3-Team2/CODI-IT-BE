import express from 'express';
import storeController from '@store/storeController';
import storeValidator from '@store/storeValidator';
const storeRouter = express.Router();

storeRouter.route('/').post(storeValidator.validateCreateStore, storeController.postStore); // post: 새 스토어 등록 - 추후 인증 미들웨어 필요

storeRouter
  .route('/:storeId')
  .patch(storeValidator.validateUpdateStore, storeController.patchStore);

export default storeRouter;
