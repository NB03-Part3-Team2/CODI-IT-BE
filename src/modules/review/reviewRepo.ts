import { prisma } from '@shared/prisma';
import {
  CreateReviewDto,
  UpdateReviewDto,
  GetReviewListQueryDto,
} from '@modules/review/dto/reviewDTO';

const selectOptionDB = {
  id: true,
  userId: true,
  productId: true,
  rating: true,
  content: true,
  createdAt: true,
};

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
      select: selectOptionDB,
    });
    return review;
  };

  getReviewById = async (reviewId: string) => {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    return review;
  };

  updateReview = async (updateReviewDto: UpdateReviewDto) => {
    const review = await prisma.review.update({
      where: { id: updateReviewDto.reviewId },
      data: {
        rating: updateReviewDto.rating,
        content: updateReviewDto.content,
      },
      select: selectOptionDB,
    });
    return review;
  };

  getReviewList = async (getReviewListQueryDto: GetReviewListQueryDto) => {
    const offset = (getReviewListQueryDto.page - 1) * getReviewListQueryDto.limit;
    const reviewList = await prisma.review.findMany({
      where: { productId: getReviewListQueryDto.productId },
      skip: offset,
      take: getReviewListQueryDto.limit,
      orderBy: { createdAt: 'desc' },
      select: selectOptionDB,
    });
    return reviewList;
  };
}

export default new ReviewRepository();
