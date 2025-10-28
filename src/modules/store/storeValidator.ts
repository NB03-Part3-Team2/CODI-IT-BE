import type { RequestHandler } from 'express';
import { forwardZodError } from '@utils/zod';
import {
  createStoreSchema,
  updateStoreSchema,
  storeIdSchema,
  paginationSchema,
} from '@modules/store/dto/storeDTO';

class StoreValidator {
  validateCreateStore: RequestHandler = async (req, res, next) => {
    try {
      // 1. 검사할 속성 정의
      const parsedBody = {
        name: req.body.name,
        address: req.body.address,
        detailAddress: req.body.detailAddress,
        phoneNumber: req.body.phoneNumber,
        content: req.body.content,
        image: req.body.image,
      };

      // 2. 스키마에 맞춰 유효성 검사
      await createStoreSchema.parseAsync(parsedBody);
      next();
    } catch (err) {
      forwardZodError(err, '스토어 등록', next);
    }
  };

  validateUpdateStore: RequestHandler = async (req, res, next) => {
    try {
      // 1. 검사할 속성 정의
      const parsedBody = {
        name: req.body.name,
        address: req.body.address,
        detailAddress: req.body.detailAddress,
        phoneNumber: req.body.phoneNumber,
        content: req.body.content,
        image: req.body.image,
      };
      const storeId = {
        storeId: req.params.storeId,
      };

      // 2. 스키마에 맞춰 유효성 검사
      await updateStoreSchema.parseAsync(parsedBody);
      await storeIdSchema.parseAsync(storeId);
      next();
    } catch (err) {
      forwardZodError(err, '스토어 수정', next);
    }
  };

  validateGetStore: RequestHandler = async (req, res, next) => {
    try {
      // 1. 검사할 속성 정의
      const storeId = {
        storeId: req.params.storeId,
      };

      // 2. 스키마에 맞춰 유효성 검사
      await storeIdSchema.parseAsync(storeId);
      next();
    } catch (err) {
      forwardZodError(err, '스토어 상세 조회', next);
    }
  };

  validateGetMyProductList: RequestHandler = async (req, res, next) => {
    try {
      // 1. 검사할 속성 정의
      const parsedQuery = {
        page: req.query.page,
        pageSize: req.query.pageSize,
      };

      // 2. 스키마에 맞춰 유효성 검사
      await paginationSchema.parseAsync(parsedQuery);
      next();
    } catch (err) {
      forwardZodError(err, '내 스토어 등록 상품 조회', next);
    }
  };
}

export default new StoreValidator();
