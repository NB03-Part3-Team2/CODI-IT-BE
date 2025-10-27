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
import { CreateStoreDto } from '@modules/store/dto/storeDTO';
import { prisma } from '@shared/prisma';

// 각 테스트 후에 모든 모의(mock)를 복원합니다.
afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('createStore', async () => {
  // 1. 테스트에 사용할 mock 데이터와 userId를 생성합니다.
  const userId = 'test-user-id';
  const dto: CreateStoreDto = {
    name: '패션스토어',
    address: '서울시 강남구 테헤란로 123',
    detailAddress: '456호',
    phoneNumber: '010-1234-5678',
    content: '트렌디한 패션 아이템을 판매하는 스토어입니다.',
    image: 'https://example.com/store1.jpg',
  };
  const testDate = new Date();
  const expectedResult = {
    id: 'mock-store-id',
    userId: userId,
    createdAt: testDate,
    updatedAt: testDate,
    name: dto.name,
    address: dto.address,
    detailAddress: dto.detailAddress,
    phoneNumber: dto.phoneNumber,
    content: dto.content,
    image: dto.image ?? null, // dto.image가 undefined이면 null을 사용
  };

  // 2. 서비스 내부에서 호출되는 레포지토리 함수들을 모킹합니다.
  const checkStoreMock = jest.spyOn(storeRepository, 'checkStoreByUserId').mockResolvedValue(null);
  const createMock = jest.spyOn(storeRepository, 'create').mockResolvedValue(expectedResult);

  // 3. 서비스 함수를 올바른 인자들로 실행합니다.
  const result = await storeService.createStore(userId, dto);

  // 4. 모의(mock)된 메소드가 올바른 인자와 함께 호출되었는지 확인합니다.
  expect(checkStoreMock).toHaveBeenCalledWith(userId);
  expect(createMock).toHaveBeenCalledWith(userId, dto); // userId와 dto를 모두 확인

  // 5. 서비스 메소드가 모의(mock)된 결과를 반환하는지 확인합니다.
  expect(result).toEqual(expectedResult);
});
