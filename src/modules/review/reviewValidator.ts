import type { RequestHandler } from 'express';
import { forwardZodError } from '@utils/zod';
import { createReviewSchema, updateReviewSchema } from '@modules/review/dto/reviewDTO';

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

  validateUpdateReview: RequestHandler = async (req, res, next) => {
    try {
      const parsedBody = {
        rating: req.body.rating,
        content: req.body.content,
        reviewId: req.params.reviewId,
      };
      req.validatedBody = await updateReviewSchema.parseAsync(parsedBody);
      next();
    } catch (err) {
      forwardZodError(err, '리뷰 수정', next);
    }
  };
}

export default new ReviewValidator();
