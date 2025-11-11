import { prisma } from '@shared/prisma';
import { afterAll, afterEach, describe, test, expect, jest } from '@jest/globals';
import reviewService from '@modules/review/reviewService';
import reviewRepository from '@modules/review/reviewRepo';
import userRepository from '@modules/user/userRepo';
import productRepo from '@modules/product/productRepo';
import { MOCK_DATA } from '@modules/review/test/services/mock';

describe('reviewCreate 단위 테스트', () => {
  // 각 테스트 후에 모든 모의(mock)를 복원
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createReview 메소드 테스트', () => {
    test('createReview 성공 테스트', async () => {
      const createReviewDto = MOCK_DATA.createReviewDto;
      const mockCreatedReview = MOCK_DATA.createdReview;
      const expectedResult = MOCK_DATA.resReview;
      const existingUser = MOCK_DATA.existingUser;

      jest.spyOn(userRepository, 'getUserById').mockResolvedValue(existingUser);
      jest.spyOn(productRepo, 'checkProductExists').mockResolvedValue(true);
      jest.spyOn(reviewRepository, 'createReview').mockResolvedValue(mockCreatedReview);

      const result = await reviewService.createReview(createReviewDto);

      expect(result).toEqual(expectedResult);
    });

    test('createReview 실패 테스트 - 사용자를 찾지 못함', async () => {
      const createReviewDto = MOCK_DATA.createReviewDto;

      jest.spyOn(userRepository, 'getUserById').mockResolvedValue(null);
      jest.spyOn(productRepo, 'checkProductExists').mockResolvedValue(true);

      await expect(reviewService.createReview(createReviewDto)).rejects.toMatchObject({
        code: 400,
        message: '사용자를 찾지 못했습니다.',
      });
    });

    test('createReview 실패 테스트 - 상품을 찾지 못함', async () => {
      const createReviewDto = MOCK_DATA.createReviewDto;
      const existingUser = MOCK_DATA.existingUser;

      jest.spyOn(userRepository, 'getUserById').mockResolvedValue(existingUser);
      jest.spyOn(productRepo, 'checkProductExists').mockResolvedValue(false);

      await expect(reviewService.createReview(createReviewDto)).rejects.toMatchObject({
        code: 400,
        message: '상품을 찾지 못했습니다.',
      });
    });
  });
});
