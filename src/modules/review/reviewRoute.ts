import express from 'express';
import reviewController from '@modules/review/reviewController';

const reviewRouter = express.Router();

reviewRouter.patch('/:reviewId/', reviewController.updateReview);

export default reviewRouter;
