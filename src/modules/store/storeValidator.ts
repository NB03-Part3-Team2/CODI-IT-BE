import type { RequestHandler } from 'express';
import { forwardZodError } from '@utils/zod';
import { createStoreSchema, updateStoreSchema, storeIdSchema } from '@modules/store/dto/storeDTO';

const validateCreateStore: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = {
      name: req.body.name,
      address: req.body.address,
      detailAddress: req.body.detailAddress,
      phoneNumber: req.body.phoneNumber,
      content: req.body.content,
      image: req.body.imag,
    };
    await createStoreSchema.parseAsync(parsedBody);
    next();
  } catch (err) {
    forwardZodError(err, '스토어 등록', next);
  }
};

const validateUpdateStore: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = {
      name: req.body.name,
      address: req.body.address,
      detailAddress: req.body.detailAddress,
      phoneNumber: req.body.phoneNumber,
      content: req.body.content,
      image: req.body.imag,
    };
    const storeId = {
      storeId: req.params.storeId,
    };

    await updateStoreSchema.parseAsync(parsedBody);
    await storeIdSchema.parseAsync(storeId);
    next();
  } catch (err) {
    forwardZodError(err, '스토어 수정', next);
  }
};

export default {
  validateCreateStore,
  validateUpdateStore,
};
