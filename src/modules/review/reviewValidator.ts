import type { RequestHandler } from 'express';
import { forwardZodError } from '@utils/zod';
import { createReviewSchema } from '@modules/review/dto/reviewDTO';

class ReviewValidator {
  validateCreateReview: RequestHandler = async (req, res, next) => {
    try {
      const parsedBody = {
        productId: req.params.productId,
        rating: req.body.rating,
        content: req.body.content,
        orderItemId: req.body.orderItemId,
      };
      req.validatedBody = await createReviewSchema.parseAsync(parsedBody);
      next();
    } catch (err) {
      forwardZodError(err, '리뷰 생성', next);
    }
  };
}

export default new ReviewValidator();
