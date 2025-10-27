/**
 * 본 파일에서 유닛 테스트 코드를 작성합니다 (예시 : 서비스)
 * mock 방식을 사용할 경우
 * 메소드가 [원하는 인자로 호출]되었는지와 모킹된 메소드가 [예상 결과값을 반환]하는지 검증합니다.
 * spy 방식을 사용할 경우
 * 메소드가 [원하는 인자로 호출]되었는지 검사합니다.
 */
import { afterAll, afterEach, describe, test, expect, jest } from '@jest/globals';
import storeService from '../../storeService';
import storeRepository from '../../storeRepo';
import { UpdateStoreDto } from '@modules/store/dto/storeDTO';
import { prisma } from '@shared/prisma';

// 각 테스트 후에 모든 모의(mock)를 복원합니다.
afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('updateStore', async () => {
  // Arrange: 테스트에 필요한 변수와 mock 객체들을 설정합니다.
  const userId = 'test-user-id';
  const storeId = 'test-store-id';
  const updateDto: UpdateStoreDto = {
    name: '새로운 패션스토어',
    content: '더 트렌디해진 패션 아이템!',
  };

  // 서비스가 처음에 호출하는 checkStoreByUserId가 반환할 가짜 스토어 정보
  const mockExistingStore = {
    id: storeId, // storeId가 일치해야 소유권 검사를 통과합니다.
  };

  const testDate = new Date();
  // 최종적으로 update 메소드가 반환할 기대 결과
  const expectedResult = {
    id: storeId,
    userId: userId,
    createdAt: testDate, // 실제로는 생성 시점의 날짜
    updatedAt: testDate,
    name: updateDto.name!,
    address: '서울시 강남구 테헤란로 123', // 원래 스토어의 정보
    detailAddress: '456호',
    phoneNumber: '010-1234-5678',
    content: updateDto.content!,
    image: null,
  };

  // 레포지토리의 함수들을 모킹합니다.
  const checkStoreMock = jest
    .spyOn(storeRepository, 'checkStoreByUserId')
    .mockResolvedValue(mockExistingStore);
  const updateMock = jest.spyOn(storeRepository, 'update').mockResolvedValue(expectedResult);

  // Act: 실제 테스트할 서비스 함수를 호출합니다.
  const result = await storeService.updateStore(userId, storeId, updateDto);

  // Assert: 함수들이 올바른 인자로 호출되었는지, 결과값이 기대와 같은지 확인합니다.
  expect(checkStoreMock).toHaveBeenCalledWith(userId);
  expect(updateMock).toHaveBeenCalledWith(storeId, updateDto);
  expect(result).toEqual(expectedResult);
});
