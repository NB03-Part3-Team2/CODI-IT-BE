import type { RequestHandler } from 'express';
import { forwardZodError } from '@utils/zod';
import { updateCartSchema } from '@modules/cart/dto/cartDTO';

class CartValidator {
  validateUpdateCart: RequestHandler = async (req, res, next) => {
    try {
      // 1. 검사할 속성 정의
      const parsedBody = {
        productId: req.body.productId,
        sizes: req.body.sizes,
      };

      // 2. 스키마에 맞춰 유효성 검사
      await updateCartSchema.parseAsync(parsedBody);
      next();
    } catch (err) {
      forwardZodError(err, '장바구니 수정', next);
    }
  };
}

export default new CartValidator();
