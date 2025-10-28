import { afterAll, afterEach, describe, test, expect, jest } from '@jest/globals';
import storeService from '@modules/store/storeService';
import storeRepository from '@modules/store/storeRepo';
import { prisma } from '@shared/prisma';

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('getStore 메소드 테스트', () => {
  test('성공', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const storeId = 'test-store-id';
    const mockStore = {
      id: storeId,
      name: '패션스토어',
      address: '서울시 강남구 테헤란로 123',
      detailAddress: '456호',
      phoneNumber: '010-1234-5678',
      content: '트렌디한 패션 아이템을 판매하는 스토어입니다.',
      image: 'https://example.com/store1.jpg',
      userId: 'userId',
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: {
        storeLikes: 500,
        products: 30,
      },
    };

    // 2. 레포지토리 함수 모킹
    const getStoreByIdMock = jest
      .spyOn(storeRepository, 'getStoreById')
      .mockResolvedValue(mockStore);

    // 3. 서비스 함수 호출
    const result = await storeService.getStore(storeId);

    // 4. 모킹된 메소드가 올바른 인자와 함께 호출되었는지 확인
    expect(getStoreByIdMock).toHaveBeenCalledWith(storeId);

    // 5. 서비스 메소드가 모킹된 결과를 반환하는지 확인
    const { _count, ...rest } = mockStore;
    const expectedResult = {
      ...rest,
      favoriteCount: _count.storeLikes,
    };
    expect(result).toEqual(expectedResult);
  });
});
