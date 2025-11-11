import express from 'express';
import reviewController from '@modules/review/reviewController';
import reviewValidator from '@modules/review/reviewValidator';
import { authMiddleware } from '@middlewares/authMiddleware';

const reviewRouter = express.Router();

reviewRouter.patch(
  '/:reviewId',
  authMiddleware,
  reviewValidator.validateUpdateReview,
  reviewController.updateReview,
);

export default reviewRouter;
