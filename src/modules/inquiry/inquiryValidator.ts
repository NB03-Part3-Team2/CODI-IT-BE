import type { RequestHandler } from 'express';
import { forwardZodError } from '@utils/zod';
import { createInquirySchema } from '@modules/inquiry/dto/inquiryDTO';
import { productIdSchema } from '@modules/product/dto/productDTO';

class InquiryValidator {
  validateCreateInquiry: RequestHandler = async (req, res, next) => {
    try {
      const parsedBody = {
        title: req.body.title,
        content: req.body.content,
        isSecret: req.body.isSecret,
      };

      const parsedParams = {
        id: req.params.productId,
      };

      req.validatedBody = await createInquirySchema.parseAsync(parsedBody);
      req.validatedParams = await productIdSchema.parseAsync(parsedParams);

      next();
    } catch (err) {
      forwardZodError(err, '상품 문의 등록', next);
    }
  };

  validateGetInquiryList: RequestHandler = async (req, res, next) => {
    try {
      const parsedParams = {
        id: req.params.productId,
      };

      req.validatedParams = await productIdSchema.parseAsync(parsedParams);

      next();
    } catch (err) {
      forwardZodError(err, '상품 문의 목록 조회', next);
    }
  };
}

export default new InquiryValidator();
