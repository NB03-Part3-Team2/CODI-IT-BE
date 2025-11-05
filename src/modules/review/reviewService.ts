import reviewRepository from '@modules/review/reviewRepo';
import userRepository from '@modules/user/userRepo';
import productRepo from '@modules/product/productRepo';
import { CreateReviewDto, ResReviewDto } from '@modules/review/dto/reviewDTO';
import { ApiError } from '@errors/ApiError';

class ReviewService {
  createReview = async (createReviewDto: CreateReviewDto): Promise<ResReviewDto> => {
    const [existingUser, existingProduct] = await Promise.all([
      userRepository.getUserById(createReviewDto.userId),
      productRepo.checkProductExists(createReviewDto.productId),
      // 추후 오더아이템 검증 추가 예정, 주문 본인인지 확인도 추가 예정
      // orderRepo.getOrderItem(createReviewDto.orderItemId),
    ]);

    if (!existingUser) {
      throw ApiError.badRequest('사용자를 찾지 못했습니다.');
    }
    if (!existingProduct) {
      throw ApiError.badRequest('상품을 찾지 못했습니다.');
    }
    // if (!orderItem) {
    //   throw ApiError.badRequest('주문 내역을 찾지 못했습니다.');
    // }
    const review = await reviewRepository.createReview(createReviewDto);
    return review;
  };
}

export default new ReviewService();
