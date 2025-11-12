import reviewRepository from '@modules/review/reviewRepo';
import userRepository from '@modules/user/userRepo';
import productRepo from '@modules/product/productRepo';
import orderRepo from '@modules/order/orderRepo';
import {
  CreateReviewDto,
  ResReviewDto,
  UpdateReviewDto,
  GetReviewListQueryDto,
} from '@modules/review/dto/reviewDTO';
import { ApiError } from '@errors/ApiError';

class ReviewService {
  createReview = async (createReviewDto: CreateReviewDto): Promise<ResReviewDto> => {
    const [existingUser, existingProduct, existingOrderItem] = await Promise.all([
      userRepository.getUserById(createReviewDto.userId),
      productRepo.checkProductExists(createReviewDto.productId),
      orderRepo.getOrderItemById(createReviewDto.orderItemId),
    ]);

    [
      [existingUser, ApiError.badRequest('사용자를 찾지 못했습니다.')],
      [existingProduct, ApiError.badRequest('상품을 찾지 못했습니다.')],
      [existingOrderItem, ApiError.badRequest('주문 내역을 찾지 못했습니다.')],
      [
        existingOrderItem?.order?.userId === createReviewDto.userId,
        ApiError.forbidden('본인의 주문 내역에 대해서만 리뷰를 작성할 수 있습니다.'),
      ],
    ].forEach(([condition, error]) => {
      if (!condition) throw error;
    });
    const review = await reviewRepository.createReview(createReviewDto);
    return review;
  };

  updateReview = async (updateReviewDto: UpdateReviewDto): Promise<ResReviewDto> => {
    const [existingUser, existingReview] = await Promise.all([
      userRepository.getUserById(updateReviewDto.userId),
      reviewRepository.getReviewById(updateReviewDto.reviewId),
    ]);

    [
      [existingUser, ApiError.badRequest('사용자를 찾지 못했습니다.')],
      [existingReview, ApiError.badRequest('리뷰를 찾지 못했습니다.')],
      [
        existingReview?.userId === updateReviewDto.userId,
        ApiError.forbidden('본인의 리뷰만 수정할 수 있습니다.'),
      ],
    ].forEach(([condition, error]) => {
      if (!condition) throw error;
    });

    const review = await reviewRepository.updateReview(updateReviewDto);
    return review;
  };

  getReviewList = async (getReviewListQueryDto: GetReviewListQueryDto): Promise<ResReviewDto[]> => {
    const existingProduct = await productRepo.checkProductExists(getReviewListQueryDto.productId);

    if (!existingProduct) {
      throw ApiError.badRequest('상품을 찾지 못했습니다.');
    }
    const reviewList = await reviewRepository.getReviewList(getReviewListQueryDto);
    return reviewList;
  };
}

export default new ReviewService();
