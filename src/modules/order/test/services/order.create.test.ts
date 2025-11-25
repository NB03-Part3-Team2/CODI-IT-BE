import { afterEach, beforeEach, describe, test, expect, jest } from '@jest/globals';
import orderService from '@modules/order/orderService';
import orderRepository from '@modules/order/orderRepo';
import productRepository from '@modules/product/productRepo';
import userRepository from '@modules/user/userRepo';
import userService from '@modules/user/userService';
import { prisma } from '@shared/prisma';
import { CreateOrderDto } from '@modules/order/dto/orderDTO';
import { ApiError } from '@errors/ApiError';
import {
  TEST_USER_ID,
  TEST_PRODUCT_ID,
  createMockOrder,
  createMockProductPriceInfo,
  createMockPayment,
  createMockStock,
} from '../mock';

// prisma 모듈 모킹
jest.mock('@shared/prisma', () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

// 각 테스트 후에 모든 모의(mock)를 복원합니다.
afterEach(() => {
  jest.restoreAllMocks();
});

// 트랜잭션 모킹 헬퍼 함수
const mockTransaction = () => {
  (prisma.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
    const mockTx = {
      user: {
        findUnique: (jest.fn() as any).mockResolvedValue({
          id: TEST_USER_ID,
          points: 0,
          grade: {
            id: 'grade-1',
            name: 'Green',
            rate: 1, // 1% 적립률
            minAmount: 0,
          },
        }),
      },
    }; // 트랜잭션 클라이언트 mock
    return await callback(mockTx);
  });
};

describe('createOrder 메소드 테스트', () => {
  beforeEach(() => {
    mockTransaction();
  });

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
    const getProductPriceInfoMock = jest
      .spyOn(productRepository, 'getProductPriceInfo')
      .mockResolvedValue(mockProductPriceInfo);

    const getUserPointsMock = jest.spyOn(userRepository, 'getUserPoints').mockResolvedValue(0);

    // 트랜잭션 내 메서드 모킹
    jest.spyOn(productRepository, 'getStockForUpdate').mockResolvedValue(createMockStock());
    jest.spyOn(orderRepository, 'createOrderData').mockResolvedValue({ id: mockCreatedOrder.id } as any);
    jest.spyOn(orderRepository, 'createOrderItems').mockResolvedValue({ count: 1 });
    jest.spyOn(orderRepository, 'createPayment').mockResolvedValue({} as any);
    jest.spyOn(productRepository, 'decrementStock').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'decrementPoints').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'incrementTotalAmount').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'incrementPoints').mockResolvedValue({} as any);
    jest.spyOn(userService, 'recalculateUserGrade').mockResolvedValue(null);
    jest.spyOn(orderRepository, 'getOrderWithDetails').mockResolvedValue(mockCreatedOrder);

    // 3. 서비스 함수를 올바른 인자들로 실행합니다.
    const result = await orderService.createOrder(userId, orderData);

    // 4. 모킹된 메소드가 올바른 인자와 함께 호출되었는지 확인
    expect(getProductPriceInfoMock).toHaveBeenCalledWith(TEST_PRODUCT_ID);
    expect(getUserPointsMock).not.toHaveBeenCalled(); // usePoint가 0이므로 호출되지 않음

    // 5. 서비스 메소드가 올바른 결과를 반환하는지 확인
    expect(result.id).toBe(mockCreatedOrder.id);
    expect(result.userId).toBe(userId);
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
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);
    jest.spyOn(productRepository, 'getStockForUpdate').mockResolvedValue(createMockStock());
    jest.spyOn(orderRepository, 'createOrderData').mockResolvedValue({ id: mockCreatedOrder.id } as any);
    jest.spyOn(orderRepository, 'createOrderItems').mockResolvedValue({ count: 1 });
    jest.spyOn(orderRepository, 'createPayment').mockResolvedValue({} as any);
    jest.spyOn(productRepository, 'decrementStock').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'incrementTotalAmount').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'incrementPoints').mockResolvedValue({} as any);
    jest.spyOn(userService, 'recalculateUserGrade').mockResolvedValue(null);
    jest.spyOn(orderRepository, 'getOrderWithDetails').mockResolvedValue(mockCreatedOrder);

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
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);
    jest.spyOn(userRepository, 'getUserPoints').mockResolvedValue(5000); // 보유 포인트 5000
    jest.spyOn(productRepository, 'getStockForUpdate').mockResolvedValue(createMockStock());
    jest.spyOn(orderRepository, 'createOrderData').mockResolvedValue({ id: mockCreatedOrder.id } as any);
    jest.spyOn(orderRepository, 'createOrderItems').mockResolvedValue({ count: 1 });
    jest.spyOn(orderRepository, 'createPayment').mockResolvedValue({} as any);
    jest.spyOn(productRepository, 'decrementStock').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'decrementPoints').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'incrementTotalAmount').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'incrementPoints').mockResolvedValue({} as any);
    jest.spyOn(userService, 'recalculateUserGrade').mockResolvedValue(null);
    jest.spyOn(orderRepository, 'getOrderWithDetails').mockResolvedValue(mockCreatedOrder);

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
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(null);

    // 3. 서비스 함수 실행 및 에러 확인
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(ApiError);
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(
      '상품 ID non-existent-product를 찾을 수 없습니다.',
    );
  });

  test('성공 - 여러 스토어의 상품들로 주문 생성', async () => {
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

    const mockCreatedOrder = {
      id: 'order-id',
      userId,
      name: '홍길동',
      address: '서울시 강남구 테헤란로 123',
      phoneNumber: '010-1234-5678',
      subtotal: 20000,
      totalQuantity: 2,
      usePoint: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: 'order-item-1',
          orderId: 'order-id',
          productId: 'product-1',
          sizeId: 1,
          price: 10000,
          quantity: 1,
          isReviewed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          product: {
            id: 'product-1',
            name: '상품 1',
            image: null,
          },
          size: {
            id: 1,
            en: 'S',
            ko: 'S',
          },
        },
        {
          id: 'order-item-2',
          orderId: 'order-id',
          productId: 'product-2',
          sizeId: 2,
          price: 10000,
          quantity: 1,
          isReviewed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          product: {
            id: 'product-2',
            name: '상품 2',
            image: null,
          },
          size: {
            id: 2,
            en: 'M',
            ko: 'M',
          },
        },
      ],
      payments: [
        {
          id: 'payment-id',
          orderId: 'order-id',
          price: 20000,
          status: 'CompletedPayment',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    // 2. 레포지토리 함수 모킹
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue({
      price: 10000,
      discountRate: 0,
      discountStartTime: null,
      discountEndTime: null,
    });
    jest.spyOn(productRepository, 'getStockForUpdate').mockResolvedValue(createMockStock());
    jest.spyOn(orderRepository, 'createOrderData').mockResolvedValue({ id: 'order-id' } as any);
    jest.spyOn(orderRepository, 'createOrderItems').mockResolvedValue({ count: 2 });
    jest.spyOn(orderRepository, 'createPayment').mockResolvedValue({} as any);
    jest.spyOn(productRepository, 'decrementStock').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'incrementTotalAmount').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'incrementPoints').mockResolvedValue({} as any);
    jest.spyOn(userService, 'recalculateUserGrade').mockResolvedValue(null);
    jest.spyOn(orderRepository, 'getOrderWithDetails').mockResolvedValue(mockCreatedOrder);

    // 3. 서비스 함수 실행
    const result = await orderService.createOrder(userId, orderData);

    // 4. 결과 검증
    expect(result).toBeDefined();
    expect(result.id).toBe('order-id');
    expect(result.userId).toBe(userId);
    expect(result.subtotal).toBe(20000);
    expect(result.totalQuantity).toBe(2);
    expect(result.orderItems).toHaveLength(2);
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
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);
    // 재고가 부족한 경우
    jest.spyOn(productRepository, 'getStockForUpdate').mockResolvedValue({ id: 'stock-1', quantity: 10 });

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
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);
    // 재고를 찾을 수 없는 경우
    jest.spyOn(productRepository, 'getStockForUpdate').mockResolvedValue(null);

    // 3. 서비스 함수 실행 및 에러 확인
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(ApiError);
    await expect(orderService.createOrder(userId, orderData)).rejects.toThrow(
      '재고를 찾을 수 없습니다',
    );
  });

  test('성공 - 포인트 적립 (Green 등급, 1% 적립)', async () => {
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

    // 2. 트랜잭션 모킹 - Green 등급 사용자 (1% 적립)
    (prisma.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
      const mockTx = {
        user: {
          findUnique: (jest.fn() as any).mockResolvedValue({
            id: userId,
            points: 0,
            grade: {
              id: 'grade-1',
              name: 'Green',
              rate: 1, // 1% 적립률
              minAmount: 0,
            },
          }),
        },
      };
      return await callback(mockTx);
    });

    // 3. 레포지토리 함수 모킹
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);
    jest.spyOn(productRepository, 'getStockForUpdate').mockResolvedValue(createMockStock());
    jest.spyOn(orderRepository, 'createOrderData').mockResolvedValue({ id: mockCreatedOrder.id } as any);
    jest.spyOn(orderRepository, 'createOrderItems').mockResolvedValue({ count: 1 });
    jest.spyOn(orderRepository, 'createPayment').mockResolvedValue({} as any);
    jest.spyOn(productRepository, 'decrementStock').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'incrementTotalAmount').mockResolvedValue({} as any);

    const incrementPointsSpy = jest.spyOn(userRepository, 'incrementPoints').mockResolvedValue({} as any);

    jest.spyOn(userService, 'recalculateUserGrade').mockResolvedValue(null);
    jest.spyOn(orderRepository, 'getOrderWithDetails').mockResolvedValue(mockCreatedOrder);

    // 4. 서비스 함수 실행
    await orderService.createOrder(userId, orderData);

    // 5. 포인트 적립이 올바르게 호출되었는지 확인
    // 결제 금액: 20,000원 (10,000원 * 2개)
    // Green 등급 적립률: 1%
    // 적립 포인트: Math.floor(20,000 * 0.01) = 200포인트
    expect(incrementPointsSpy).toHaveBeenCalledWith(userId, 200, expect.anything());
  });

  test('성공 - 포인트 적립과 포인트 사용 동시 진행', async () => {
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
      usePoint: 5000, // 5,000포인트 사용
    };

    const mockProductPriceInfo = createMockProductPriceInfo();
    const mockCreatedOrder = createMockOrder(testDate, {
      usePoint: 5000,
      payments: [createMockPayment(testDate, { price: 15000 })], // 20000 - 5000
    });

    // 2. 트랜잭션 모킹 - Orange 등급 사용자 (2% 적립)
    (prisma.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
      const mockTx = {
        user: {
          findUnique: (jest.fn() as any).mockResolvedValue({
            id: userId,
            points: 10000,
            grade: {
              id: 'grade-2',
              name: 'Orange',
              rate: 2, // 2% 적립률
              minAmount: 100000,
            },
          }),
        },
      };
      return await callback(mockTx);
    });

    // 3. 레포지토리 함수 모킹
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);
    jest.spyOn(userRepository, 'getUserPoints').mockResolvedValue(10000); // 보유 포인트
    jest.spyOn(productRepository, 'getStockForUpdate').mockResolvedValue(createMockStock());
    jest.spyOn(orderRepository, 'createOrderData').mockResolvedValue({ id: mockCreatedOrder.id } as any);
    jest.spyOn(orderRepository, 'createOrderItems').mockResolvedValue({ count: 1 });
    jest.spyOn(orderRepository, 'createPayment').mockResolvedValue({} as any);
    jest.spyOn(productRepository, 'decrementStock').mockResolvedValue({} as any);

    const decrementPointsSpy = jest.spyOn(userRepository, 'decrementPoints').mockResolvedValue({} as any);

    jest.spyOn(userRepository, 'incrementTotalAmount').mockResolvedValue({} as any);

    const incrementPointsSpy = jest.spyOn(userRepository, 'incrementPoints').mockResolvedValue({} as any);

    jest.spyOn(userService, 'recalculateUserGrade').mockResolvedValue(null);
    jest.spyOn(orderRepository, 'getOrderWithDetails').mockResolvedValue(mockCreatedOrder);

    // 4. 서비스 함수 실행
    await orderService.createOrder(userId, orderData);

    // 5. 포인트 차감 확인
    expect(decrementPointsSpy).toHaveBeenCalledWith(userId, 5000, expect.anything());

    // 6. 포인트 적립 확인
    // 결제 금액: 15,000원 (20,000원 - 5,000포인트)
    // Orange 등급 적립률: 2%
    // 적립 포인트: Math.floor(15,000 * 0.02) = 300포인트
    expect(incrementPointsSpy).toHaveBeenCalledWith(userId, 300, expect.anything());
  });

  test('성공 - 등급별 적립률 차이 (VIP 등급, 7% 적립)', async () => {
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
          quantity: 10, // 10개 주문 (100,000원)
        },
      ],
      usePoint: 0,
    };

    const mockProductPriceInfo = createMockProductPriceInfo();
    const mockCreatedOrder = createMockOrder(testDate, {
      subtotal: 100000,
      totalQuantity: 10,
    });

    // 2. 트랜잭션 모킹 - VIP 등급 사용자 (7% 적립)
    (prisma.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
      const mockTx = {
        user: {
          findUnique: (jest.fn() as any).mockResolvedValue({
            id: userId,
            points: 50000,
            grade: {
              id: 'grade-5',
              name: 'VIP',
              rate: 7, // 7% 적립률
              minAmount: 1000000,
            },
          }),
        },
      };
      return await callback(mockTx);
    });

    // 3. 레포지토리 함수 모킹
    jest.spyOn(productRepository, 'getProductPriceInfo').mockResolvedValue(mockProductPriceInfo);
    jest.spyOn(productRepository, 'getStockForUpdate').mockResolvedValue(createMockStock());
    jest.spyOn(orderRepository, 'createOrderData').mockResolvedValue({ id: mockCreatedOrder.id } as any);
    jest.spyOn(orderRepository, 'createOrderItems').mockResolvedValue({ count: 1 });
    jest.spyOn(orderRepository, 'createPayment').mockResolvedValue({} as any);
    jest.spyOn(productRepository, 'decrementStock').mockResolvedValue({} as any);
    jest.spyOn(userRepository, 'incrementTotalAmount').mockResolvedValue({} as any);

    const incrementPointsSpy = jest.spyOn(userRepository, 'incrementPoints').mockResolvedValue({} as any);

    jest.spyOn(userService, 'recalculateUserGrade').mockResolvedValue(null);
    jest.spyOn(orderRepository, 'getOrderWithDetails').mockResolvedValue(mockCreatedOrder);

    // 4. 서비스 함수 실행
    await orderService.createOrder(userId, orderData);

    // 5. 포인트 적립이 올바르게 호출되었는지 확인
    // 결제 금액: 100,000원
    // VIP 등급 적립률: 7%
    // 적립 포인트: Math.floor(100,000 * 0.07) = 7,000포인트
    expect(incrementPointsSpy).toHaveBeenCalledWith(userId, 7000, expect.anything());
  });
});
