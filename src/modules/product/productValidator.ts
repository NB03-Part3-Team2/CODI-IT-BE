import type { RequestHandler } from 'express';
import { forwardZodError } from '@utils/zod';
import { createProductSchema } from '@modules/product/dto/productDTO';

class ProductValidator {
  validateCreateProduct: RequestHandler = async (req, res, next) => {
    try {
      const parsedBody = {
        ...req.body,
        categoryName: req.body.categoryName.toUpperCase(),
        price: parseInt(req.body.price, 10),
        discountRate: req.body.discountRate ? parseInt(req.body.discountRate, 10) : 0,
        stocks: JSON.parse(req.body.stocks), // stocks는 JSON 문자열로 올 것임
      };

      await createProductSchema.parseAsync(parsedBody);

      // 파싱된 값을 다음 미들웨어(컨트롤러)로 전달하기 위해 req.body를 덮어씁니다.
      req.body = parsedBody;

      next();
    } catch (err) {
      forwardZodError(err, '상품 등록', next);
    }
  };
}

export default new ProductValidator();
