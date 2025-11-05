import { Request, Response } from 'express';
import reviewService from '@modules/review/reviewService';
import { CreateReviewDto } from '@modules/review/dto/reviewDTO';

class ReviewController {
  createReview = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const createReviewDto: CreateReviewDto = {
      ...req.validatedBody,
      userId,
    };
    const review = await reviewService.createReview(createReviewDto);
    res.status(201).json(review);
  };
}

export default new ReviewController();
