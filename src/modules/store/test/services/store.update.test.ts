import { afterAll, afterEach, describe, test, expect, jest } from '@jest/globals';
import storeService from '@modules/store/storeService';
import storeRepository from '@modules/store/storeRepo';
import { prisma } from '@shared/prisma';
import { userId, storeId, mockStore, updateStoreDto } from '@modules/store/test/mock';

// 각 테스트 후에 모든 모의(mock)를 복원합니다.
afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('updateStore 메소드 테스트', () => {
  test('성공', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성

    // 서비스가 처음에 호출하는 getStoreIdByUserId가 반환할 가짜 스토어 정보
    const mockExistingStore = {
      id: storeId, // storeId가 일치해야 소유권 검사를 통과합니다.
    };

    // 최종적으로 update 메소드가 반환할 기대 결과
    const expectedResult = {
      id: mockStore.id,
      userId: mockStore.userId,
      createdAt: mockStore.createdAt, // 실제로는 생성 시점의 날짜
      updatedAt: new Date(),
      name: updateStoreDto.name!,
      address: mockStore.address, // 원래 스토어의 정보
      detailAddress: mockStore.detailAddress,
      phoneNumber: mockStore.phoneNumber,
      content: updateStoreDto.content!,
      image: mockStore.image,
    };

    // 2. 레포지토리 함수 모킹
    const checkStoreMock = jest
      .spyOn(storeRepository, 'getStoreIdByUserId')
      .mockResolvedValue(mockExistingStore);
    const updateMock = jest.spyOn(storeRepository, 'update').mockResolvedValue(expectedResult);

    // 3. 서비스 함수 호출
    const result = await storeService.updateStore(userId, storeId, updateStoreDto);

    // 4. 모킹된 메소드가 올바른 인자와 함께 호출되었는지 확인.
    expect(checkStoreMock).toHaveBeenCalledWith(userId);
    expect(updateMock).toHaveBeenCalledWith(storeId, updateStoreDto);

    // 5. 서비스 메소드가 모킹된 결과를 반환하는지 확인
    expect(result).toEqual(expectedResult);
  });
});
