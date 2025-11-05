import type { RequestHandler } from 'express';
import { forwardZodError } from '@utils/zod';
import { createProductSchema, getProductListSchema } from '@modules/product/dto/productDTO';

class ProductValidator {
  validateCreateProduct: RequestHandler = async (req, res, next) => {
    try {
      // 1. 검사할 속성 정의
      const parsedBody = {
        name: req.body.name,
        categoryName: req.body.categoryName.toUpperCase(),
        price: parseInt(req.body.price, 10),
        image: req.body.image ?? null,
        discountRate: req.body.discountRate ? parseInt(req.body.discountRate, 10) : 0,
        discountStartTime: req.body.discountStartTime,
        discountEndTime: req.body.discountEndTime,
        content: req.body.content,
        stocks: JSON.parse(req.body.stocks), // stocks는 JSON 문자열로 올 것임
      };

      // 2. 스키마에 맞춰 유효성 검사
      req.validatedBody = await createProductSchema.parseAsync(parsedBody);

      next();
    } catch (err) {
      forwardZodError(err, '상품 등록', next);
    }
  };

  validateGetProductList: RequestHandler = async (req, res, next) => {
    try {
      // 1. 검사할 속성 정의
      const parsedQuery = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
        search: req.query.search as string | undefined,
        sort: req.query.sort as string | undefined,
        priceMin: req.query.priceMin ? parseInt(req.query.priceMin as string, 10) : undefined,
        priceMax: req.query.priceMax ? parseInt(req.query.priceMax as string, 10) : undefined,
        size: req.query.size as string | undefined,
        favoriteStore: req.query.favoriteStore ? (req.query.favoriteStore as string) : undefined,
        categoryName: req.query.categoryName
          ? (req.query.categoryName as string).toUpperCase()
          : undefined,
      };

      // 2. 스키마에 맞춰 유효성 검사
      req.validatedQuery = await getProductListSchema.parseAsync(parsedQuery);

      next();
    } catch (err) {
      forwardZodError(err, '상품 목록 조회', next);
    }
  };
}

export default new ProductValidator();
