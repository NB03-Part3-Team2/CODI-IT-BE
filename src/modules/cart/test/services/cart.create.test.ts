import { afterEach, describe, test, expect, jest } from '@jest/globals';
import cartService from '@modules/cart/cartService';
import cartRepository from '@modules/cart/cartRepo';
import { CreatedCartDTO } from '@modules/cart/dto/cartDTO';

// 각 테스트 후에 모든 모의(mock)를 복원합니다.
afterEach(() => {
  jest.restoreAllMocks();
});

describe('createOrGetCart 메소드 테스트', () => {
  test('성공 - 기존 장바구니가 없는 경우 (장바구니 생성)', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = 'test-user-id';
    const testDate = new Date();

    const mockCartFromDB = {
      id: 'mock-cart-id',
      userId: userId,
      createdAt: testDate,
      updatedAt: testDate,
      items: [], // 새로 생성된 장바구니는 items가 비어있음
    };

    const expectedResult: CreatedCartDTO = {
      id: 'mock-cart-id',
      buyerId: userId,
      quantity: 0, // items가 비어있으므로 0
      createdAt: testDate,
      updatedAt: testDate,
    };

    // 2. 레포지토리 함수 모킹
    const findByUserIdMock = jest.spyOn(cartRepository, 'findByUserId').mockResolvedValue(null); // 기존 장바구니가 없음
    const createMock = jest.spyOn(cartRepository, 'create').mockResolvedValue(mockCartFromDB);

    // 3. 서비스 함수를 올바른 인자들로 실행합니다.
    const result = await cartService.createOrGetCart(userId);

    // 4. 모킹된 메소드가 올바른 인자와 함께 호출되었는지 확인
    expect(findByUserIdMock).toHaveBeenCalledWith(userId);
    expect(createMock).toHaveBeenCalledWith(userId);

    // 5. 서비스 메소드가 모킹된 결과를 반환하는지 확인
    expect(result).toEqual(expectedResult);
  });

  test('성공 - 기존 장바구니가 있는 경우 (장바구니 조회)', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = 'test-user-id';
    const testDate = new Date();

    const mockCartFromDB = {
      id: 'existing-cart-id',
      userId: userId,
      createdAt: testDate,
      updatedAt: testDate,
      items: [{ quantity: 2 }, { quantity: 3 }, { quantity: 1 }], // 총 6개 아이템
    };

    const expectedResult: CreatedCartDTO = {
      id: 'existing-cart-id',
      buyerId: userId,
      quantity: 6,
      createdAt: testDate,
      updatedAt: testDate,
    };

    // 2. 레포지토리 함수 모킹
    const findByUserIdMock = jest
      .spyOn(cartRepository, 'findByUserId')
      .mockResolvedValue(mockCartFromDB); // 기존 장바구니가 있음
    const createMock = jest.spyOn(cartRepository, 'create').mockResolvedValue(mockCartFromDB);

    // 3. 서비스 함수를 올바른 인자들로 실행합니다.
    const result = await cartService.createOrGetCart(userId);

    // 4. 모킹된 메소드가 올바른 인자와 함께 호출되었는지 확인
    expect(findByUserIdMock).toHaveBeenCalledWith(userId);
    expect(createMock).not.toHaveBeenCalled(); // 기존 장바구니가 있으므로 create가 호출되지 않음

    // 5. 서비스 메소드가 모킹된 결과를 반환하는지 확인
    expect(result).toEqual(expectedResult);
  });
});
