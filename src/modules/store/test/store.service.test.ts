/**
 * 본 파일에서 유닛 테스트 코드를 작성합니다 (예시 : 서비스)
 * mock 방식을 사용할 경우
 * 메소드가 [원하는 인자로 호출]되었는지와 모킹된 메소드가 [예상 결과값을 반환]하는지 검증합니다.
 * spy 방식을 사용할 경우
 * 메소드가 [원하는 인자로 호출]되었는지 검사합니다.
 */
import { afterAll, afterEach, describe, test, expect, jest } from '@jest/globals';
import storeService from '../storeService';
import storeRepository from '../storeRepo';
import { CreateStoreDto, UpdateStoreDto } from '@store/dto/storeDTO';
import { prisma } from '@shared/prisma';

describe('StoreService 단위 테스트', () => {
  // 각 테스트 후에 모든 모의(mock)를 복원합니다.
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createStore', () => {
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
      const checkStoreMock = jest
        .spyOn(storeRepository, 'checkStoreByUserId')
        .mockResolvedValue(null);
      const createMock = jest.spyOn(storeRepository, 'create').mockResolvedValue(expectedResult);

      // 3. 서비스 함수를 올바른 인자들로 실행합니다.
      const result = await storeService.createStore(userId, dto);

      // 4. 모의(mock)된 메소드가 올바른 인자와 함께 호출되었는지 확인합니다.
      expect(checkStoreMock).toHaveBeenCalledWith(userId);
      expect(createMock).toHaveBeenCalledWith(userId, dto); // userId와 dto를 모두 확인

      // 5. 서비스 메소드가 모의(mock)된 결과를 반환하는지 확인합니다.
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateStore', () => {
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
  });
});
