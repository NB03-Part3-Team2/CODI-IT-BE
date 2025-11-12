import { prisma } from '@shared/prisma';
import { afterAll, afterEach, describe, test, expect, jest } from '@jest/globals';
import reviewService from '@modules/review/reviewService';
import reviewRepository from '@modules/review/reviewRepo';
import productRepo from '@modules/product/productRepo';
import { MOCK_DATA } from '@modules/review/test/services/mock';

describe('reviewGetList 단위 테스트', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getReviewList 메소드 테스트', () => {
    test('getReviewList 성공 테스트 - 리뷰가 있는 경우', async () => {
      const getReviewListQueryDto = MOCK_DATA.getReviewListQueryDto;
      const reviewList = MOCK_DATA.reviewList;

      jest.spyOn(productRepo, 'checkProductExists').mockResolvedValue(true);
      jest.spyOn(reviewRepository, 'getReviewList').mockResolvedValue(reviewList);

      const result = await reviewService.getReviewList(getReviewListQueryDto);

      expect(productRepo.checkProductExists).toHaveBeenCalledWith(getReviewListQueryDto.productId);
      expect(reviewRepository.getReviewList).toHaveBeenCalledWith(getReviewListQueryDto);
      expect(result).toEqual(reviewList);
      expect(result).toHaveLength(2);
    });

    test('getReviewList 성공 테스트 - 리뷰가 없는 경우', async () => {
      const getReviewListQueryDto = MOCK_DATA.getReviewListQueryDto;
      const emptyReviewList = MOCK_DATA.emptyReviewList;

      jest.spyOn(productRepo, 'checkProductExists').mockResolvedValue(true);
      jest.spyOn(reviewRepository, 'getReviewList').mockResolvedValue(emptyReviewList);

      const result = await reviewService.getReviewList(getReviewListQueryDto);

      expect(result).toEqual(emptyReviewList);
      expect(result).toHaveLength(0);
    });

    test('getReviewList 실패 테스트 - 상품을 찾지 못함', async () => {
      const getReviewListQueryDto = MOCK_DATA.getReviewListQueryDto;

      jest.spyOn(productRepo, 'checkProductExists').mockResolvedValue(false);
      const getReviewListSpy = jest.spyOn(reviewRepository, 'getReviewList');

      await expect(reviewService.getReviewList(getReviewListQueryDto)).rejects.toMatchObject({
        code: 400,
        message: '상품을 찾지 못했습니다.',
      });

      expect(productRepo.checkProductExists).toHaveBeenCalledWith(getReviewListQueryDto.productId);
      expect(getReviewListSpy).not.toHaveBeenCalled();
    });
  });
});
