import { prisma } from '@shared/prisma';
import { CreateReviewDto } from '@modules/review/dto/reviewDTO';

class ReviewRepository {
  createReview = async (createReviewDto: CreateReviewDto) => {
    const review = await prisma.review.create({
      data: {
        userId: createReviewDto.userId,
        productId: createReviewDto.productId,
        orderItemId: createReviewDto.orderItemId,
        content: createReviewDto.content,
        rating: createReviewDto.rating,
      },
      select: {
        id: true,
        userId: true,
        productId: true,
        rating: true,
        content: true,
        createdAt: true,
      },
    });
    return review;
  };
}

export default new ReviewRepository();
