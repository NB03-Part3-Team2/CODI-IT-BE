import { afterEach, describe, test, expect, jest } from '@jest/globals';
import orderService from '@modules/order/orderService';
import orderRepository from '@modules/order/orderRepo';
import productRepository from '@modules/product/productRepo';
import userRepository from '@modules/user/userRepo';
import { CreateOrderDto } from '@modules/order/dto/orderDTO';
import { ApiError } from '@errors/ApiError';
import {
  TEST_USER_ID,
  TEST_STORE_ID,
  TEST_PRODUCT_ID,
  createMockOrder,
  createMockProductPriceInfo,
  createMockPayment,
} from '../mock';

// 각 테스트 후에 모든 모의(mock)를 복원합니다.
afterEach(() => {
  jest.restoreAllMocks();
});

describe('createOrder 메소드 테스트', () => {
  test('성공 - 할인 없는 상품으로 주문 생성', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = TEST_USER_ID;
    const testDate = new Date();

    const orderData: CreateOrderDto = {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      orderItems: [
        {
          productId: TEST_PRODUCT_ID,
          sizeId: 1,
          quantity: 2,
        },
      ],
      usePoint: 0,
    };

    const mockProductPriceInfo = createMockProductPriceInfo();
    const mockCreatedOrder = createMockOrder(testDate);

    // 2. 레포지토리 함수 모킹
    const getStoreIdMock = jest
      .spyOn(productRepository, 'getStoreIdByProductId')
      .mockResolvedValue(TEST_STORE_ID);

    const getProductPriceInfoMock = jest
      .spyOn(productRepository, 'getProductPriceInfo')
      .mockResolvedValue(mockProductPriceInfo);

    const getUserPointsMock = jest.spyOn(userRepository, 'getUserPoints').mockResolvedValue(0);

    const createOrderMock = jest
      .spyOn(orderRepository, 'createOrder')
      .mockResolvedValue(mockCreatedOrder);

    // 3. 서비스 함수를 올바른 인자들로 실행합니다.
    const result = await orderService.createOrder(userId, orderData);

    // 4. 모킹된 메소드가 올바른 인자와 함께 호출되었는지 확인
    expect(getStoreIdMock).toHaveBeenCalledWith(TEST_PRODUCT_ID);
    expect(getProductPriceInfoMock).toHaveBeenCalledWith(TEST_PRODUCT_ID);
    expect(getUserPointsMock).not.toHaveBeenCalled(); // usePoint가 0이므로 호출되지 않음
    expect(createOrderMock).toHaveBeenCalled();

    // 5. 서비스 메소드가 올바른 결과를 반환하는지 확인
    expect(result.id).toBe(mockCreatedOrder.id);
    expect(result.userId).toBe(userId);
    expect(result.storeId).toBe(TEST_STORE_ID);
    expect(result.subtotal).toBe(20000); // 10000 * 2
    expect(result.totalQuantity).toBe(2);
  });

  test('성공 - 할인이 적용된 상품으로 주문 생성', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = TEST_USER_ID;
    const testDate = new Date();

    const orderData: CreateOrderDto = {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      orderItems: [
        {
          productId: TEST_PRODUCT_ID,
          sizeId: 1,
          quantity: 2,
        },
      ],
      usePoint: 0,
    };

    // 10% 할인이 적용된 상품
    const mockProductPriceInfo = createMockProductPriceInfo({
      price: 10000,
      discountRate: 10,
      discountStartTime: new Date(testDate.getTime() - 1000 * 60 * 60), // 1시간 전
      discountEndTime: new Date(testDate.getTime() + 1000 * 60 * 60), // 1시간 후
    });

    const mockCreatedOrder = createMockOrder(testDate, {
      subtotal: 18000, // (10000 * 0.9) * 2 = 9000 * 2
      items: [
        {
          ...createMockOrder(testDate).items[0],
          price: 9000, // 할인 적용 가격
          quantity: 2,
        },
      ],
    });

    // 2. 레포지토리 함수 모킹
    jest.spyOn(productRepository, 'getStoreIdByProductId').mockResolvedValue(TEST_STORE_ID);
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);
    jest.spyOn(orderRepository, 'createOrder').mockResolvedValue(mockCreatedOrder);

    // 3. 서비스 함수 실행
    const result = await orderService.createOrder(userId, orderData);

    // 4. 할인이 올바르게 적용되었는지 확인
    expect(result.subtotal).toBe(18000);
    expect(result.orderItems[0].price).toBe(9000);
  });

  test('성공 - 포인트를 사용한 주문 생성', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = TEST_USER_ID;
    const testDate = new Date();

    const orderData: CreateOrderDto = {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      orderItems: [
        {
          productId: TEST_PRODUCT_ID,
          sizeId: 1,
          quantity: 2,
        },
      ],
      usePoint: 1000,
    };

    const mockProductPriceInfo = createMockProductPriceInfo();
    const mockCreatedOrder = createMockOrder(testDate, {
      usePoint: 1000,
      payments: [createMockPayment(testDate, { price: 19000 })], // 20000 - 1000
    });

    // 2. 레포지토리 함수 모킹
    jest.spyOn(productRepository, 'getStoreIdByProductId').mockResolvedValue(TEST_STORE_ID);
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);
    jest.spyOn(userRepository, 'getUserPoints').mockResolvedValue(5000); // 보유 포인트 5000
    jest.spyOn(orderRepository, 'createOrder').mockResolvedValue(mockCreatedOrder);

    // 3. 서비스 함수 실행
    const result = await orderService.createOrder(userId, orderData);

    // 4. 포인트가 올바르게 적용되었는지 확인
    expect(result.usePoint).toBe(1000);
    expect(result.payments.price).toBe(19000); // subtotal - usePoint = 20000 - 1000 = 19000
  });

  test('실패 - 주문 아이템이 비어있는 경우', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = TEST_USER_ID;

    const orderData: CreateOrderDto = {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      orderItems: [],
      usePoint: 0,
    };

    // 2. 서비스 함수 실행 및 에러 확인
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(ApiError);
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(
      '주문 아이템이 없습니다.',
    );
  });

  test('실패 - 존재하지 않는 상품으로 주문 생성', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = TEST_USER_ID;

    const orderData: CreateOrderDto = {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      orderItems: [
        {
          productId: 'non-existent-product',
          sizeId: 1,
          quantity: 2,
        },
      ],
      usePoint: 0,
    };

    // 2. 레포지토리 함수 모킹 (상품을 찾을 수 없음)
    jest.spyOn(productRepository, 'getStoreIdByProductId').mockResolvedValue(null);

    // 3. 서비스 함수 실행 및 에러 확인
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(ApiError);
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(
      '상품 ID non-existent-product를 찾을 수 없습니다.',
    );
  });

  test('실패 - 다른 스토어의 상품들로 주문 생성', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = TEST_USER_ID;

    const orderData: CreateOrderDto = {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      orderItems: [
        {
          productId: 'product-1',
          sizeId: 1,
          quantity: 1,
        },
        {
          productId: 'product-2',
          sizeId: 2,
          quantity: 1,
        },
      ],
      usePoint: 0,
    };

    // 2. 레포지토리 함수 모킹 (다른 스토어의 상품들)
    const getStoreIdMock = jest.spyOn(productRepository, 'getStoreIdByProductId');
    getStoreIdMock.mockResolvedValueOnce('store-1').mockResolvedValueOnce('store-2');

    // 3. 서비스 함수 실행 및 에러 확인
    try {
      await orderService.createOrder(userId, orderData);
      // 에러가 발생하지 않으면 테스트 실패
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe('주문은 같은 스토어의 상품들만 포함할 수 있습니다.');
    }
  });

  test('실패 - 보유 포인트보다 많은 포인트 사용', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = TEST_USER_ID;

    const orderData: CreateOrderDto = {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      orderItems: [
        {
          productId: TEST_PRODUCT_ID,
          sizeId: 1,
          quantity: 2,
        },
      ],
      usePoint: 6000, // 보유 포인트보다 많음
    };

    const mockProductPriceInfo = createMockProductPriceInfo();

    // 2. 레포지토리 함수 모킹
    jest.spyOn(productRepository, 'getStoreIdByProductId').mockResolvedValue(TEST_STORE_ID);
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);
    jest.spyOn(userRepository, 'getUserPoints').mockResolvedValue(5000); // 보유 포인트 5000

    // 3. 서비스 함수 실행 및 에러 확인
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(ApiError);
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(
      '사용 가능한 포인트가 부족합니다.',
    );
  });

  test('실패 - 주문 금액보다 많은 포인트 사용', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = TEST_USER_ID;

    const orderData: CreateOrderDto = {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      orderItems: [
        {
          productId: TEST_PRODUCT_ID,
          sizeId: 1,
          quantity: 2,
        },
      ],
      usePoint: 25000, // 주문 금액(20000)보다 많음
    };

    const mockProductPriceInfo = createMockProductPriceInfo();

    // 2. 레포지토리 함수 모킹
    jest.spyOn(productRepository, 'getStoreIdByProductId').mockResolvedValue(TEST_STORE_ID);
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);
    jest.spyOn(userRepository, 'getUserPoints').mockResolvedValue(30000); // 보유 포인트는 충분함

    // 3. 서비스 함수 실행 및 에러 확인
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(ApiError);
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(
      '사용 포인트는 주문 금액을 초과할 수 없습니다.',
    );
  });

  test('실패 - 재고 부족으로 주문 생성 실패', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = TEST_USER_ID;

    const orderData: CreateOrderDto = {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      orderItems: [
        {
          productId: TEST_PRODUCT_ID,
          sizeId: 1,
          quantity: 100, // 재고보다 많은 수량
        },
      ],
      usePoint: 0,
    };

    const mockProductPriceInfo = createMockProductPriceInfo();

    // 2. 레포지토리 함수 모킹
    jest.spyOn(productRepository, 'getStoreIdByProductId').mockResolvedValue(TEST_STORE_ID);
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);

    // createOrder가 트랜잭션 내에서 재고 부족 에러를 throw
    jest
      .spyOn(orderRepository, 'createOrder')
      .mockRejectedValue(
        ApiError.badRequest(
          '상품 ID test-product-id, 사이즈 ID 1의 재고가 부족합니다. (요청: 100, 재고: 10)',
        ),
      );

    // 3. 서비스 함수 실행 및 에러 확인
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(ApiError);
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow('재고가 부족합니다');
  });

  test('실패 - 존재하지 않는 재고로 주문 생성 실패', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = TEST_USER_ID;

    const orderData: CreateOrderDto = {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      orderItems: [
        {
          productId: TEST_PRODUCT_ID,
          sizeId: 999, // 존재하지 않는 사이즈
          quantity: 2,
        },
      ],
      usePoint: 0,
    };

    const mockProductPriceInfo = createMockProductPriceInfo();

    // 2. 레포지토리 함수 모킹
    jest.spyOn(productRepository, 'getStoreIdByProductId').mockResolvedValue(TEST_STORE_ID);
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);

    // createOrder가 트랜잭션 내에서 재고를 찾을 수 없음 에러를 throw
    jest
      .spyOn(orderRepository, 'createOrder')
      .mockRejectedValue(
        ApiError.notFound('상품 ID test-product-id, 사이즈 ID 999에 대한 재고를 찾을 수 없습니다.'),
      );

    // 3. 서비스 함수 실행 및 에러 확인
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(ApiError);
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(
      '재고를 찾을 수 없습니다',
    );
  });
});
