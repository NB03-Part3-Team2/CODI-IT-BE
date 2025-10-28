import { afterAll, afterEach, describe, test, expect, jest } from '@jest/globals';
import storeService from '@modules/store/storeService';
import storeRepository from '@modules/store/storeRepo';
import { prisma } from '@shared/prisma';

describe('getMyStore 메소드 테스트', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('성공', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = 'test-user-id';
    const storeId = 'test-store-id';
    const storeInfo = { id: storeId };
    const store = {
      id: storeId,
      name: '패션스토어',
      address: '서울시 강남구 테헤란로 123',
      detailAddress: '456호',
      phoneNumber: '010-1234-5678',
      content: '트렌디한 패션 아이템을 판매하는 스토어입니다.',
      image: 'https://example.com/store1.jpg',
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: {
        products: 10,
        storeLikes: 150,
      },
    };
    const monthFavoritCount = 25;
    const totalSoldCount = 500;

    // 2. 레포지토리 함수 모킹
    const getStoreIdByUserIdMock = jest
      .spyOn(storeRepository, 'getStoreIdByUserId')
      .mockResolvedValue(storeInfo);
    const getStoreByIdMock = jest.spyOn(storeRepository, 'getStoreById').mockResolvedValue(store);
    const countMonthlyLikesByStoreIdMock = jest
      .spyOn(storeRepository, 'getMonthlyLikesByStoreId')
      .mockResolvedValue(monthFavoritCount);
    const sumTotalSalesByStoreIdMock = jest
      .spyOn(storeRepository, 'getTotalSalesByStoreId')
      .mockResolvedValue(totalSoldCount);

    // 3. 서비스 함수 호출
    const result = await storeService.getMyStore(userId);

    // 4. 모킹된 메소드가 올바른 인자와 함께 호출되었는지 확인
    expect(getStoreIdByUserIdMock).toHaveBeenCalledWith(userId);
    expect(getStoreByIdMock).toHaveBeenCalledWith(storeId);
    expect(countMonthlyLikesByStoreIdMock).toHaveBeenCalledWith(storeId);
    expect(sumTotalSalesByStoreIdMock).toHaveBeenCalledWith(storeId);

    // 5. 서비스 메소드가 예상된 결과를 반환하는지 확인
    const { _count, ...rest } = store;
    const expectedResult = {
      ...rest,
      productCount: 10,
      favoriteCount: 150,
      monthFavoritCount,
      totalSoldCount,
    };
    expect(result).toEqual(expectedResult);
  });
});
