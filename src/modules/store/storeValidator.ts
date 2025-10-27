import type { RequestHandler } from 'express';
import { forwardZodError } from '@utils/zod';
import { createStoreSchema, updateStoreSchema, storeIdSchema } from '@modules/store/dto/storeDTO';

class StoreValidator {
  validateCreateStore: RequestHandler = async (req, res, next) => {
    // 1. 검사할 속성 정의
    try {
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
    // 1. 검사할 속성 정의
    try {
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
}

export default new StoreValidator();
