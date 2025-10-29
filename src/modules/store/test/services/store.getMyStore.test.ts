import { afterAll, afterEach, describe, test, expect, jest } from '@jest/globals';
import storeService from '@modules/store/storeService';
import storeRepository from '@modules/store/storeRepo';
import { prisma } from '@shared/prisma';
import { userId, storeId, mockStore } from '../mock';

describe('getMyStore 메소드 테스트', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('성공', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const storeInfo = { id: storeId };
    const mockStoreFromDB = {
      ...mockStore,
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
    const getStoreByIdMock = jest
      .spyOn(storeRepository, 'getStoreById')
      .mockResolvedValue(mockStoreFromDB);
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
    const expectedResult = {
      ...mockStore,
      productCount: mockStoreFromDB._count.products,
      favoriteCount: mockStoreFromDB._count.storeLikes,
      monthFavoritCount,
      totalSoldCount,
    };
    expect(result).toEqual(expectedResult);
  });
});
