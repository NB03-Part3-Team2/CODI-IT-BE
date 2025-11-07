// Order 테스트용 Mock 데이터

/**
 * 공통 테스트 상수
 */
export const TEST_USER_ID = 'test-user-id';
export const TEST_STORE_ID = 'test-store-id';
export const TEST_PRODUCT_ID = 'test-product-id';
export const TEST_ORDER_ID = 'test-order-id';

/**
 * 상품 가격 정보 Mock 데이터
 */
export interface MockProductPriceInfo {
  price: number;
  discountRate: number;
  discountStartTime: Date | null;
  discountEndTime: Date | null;
}

export const createMockProductPriceInfo = (
  override?: Partial<MockProductPriceInfo>,
): MockProductPriceInfo => ({
  price: 10000,
  discountRate: 0,
  discountStartTime: null,
  discountEndTime: null,
  ...override,
});

/**
 * 재고 정보 Mock 데이터
 */
export interface MockStock {
  id: string;
  quantity: number;
}

export const createMockStock = (override?: Partial<MockStock>): MockStock => ({
  id: 'stock-1',
  quantity: 100,
  ...override,
});

/**
 * Size Mock 데이터
 */
export interface MockSize {
  id: number;
  en: string;
  ko: string;
}

export const createMockSize = (override?: Partial<MockSize>): MockSize => ({
  id: 1,
  en: 'M',
  ko: '중',
  ...override,
});

/**
 * Product Mock 데이터
 */
export interface MockProduct {
  id: string;
  name: string;
  image: string | null;
}

export const createMockProduct = (override?: Partial<MockProduct>): MockProduct => ({
  id: TEST_PRODUCT_ID,
  name: '테스트 상품',
  image: 'https://example.com/product.jpg',
  ...override,
});

/**
 * OrderItem Mock 데이터
 */
export interface MockOrderItem {
  id: string;
  orderId: string;
  productId: string;
  sizeId: number;
  price: number;
  quantity: number;
  isReviewed: boolean;
  createdAt: Date;
  updatedAt: Date;
  product: MockProduct;
  size: MockSize;
}

export const createMockOrderItem = (
  testDate: Date,
  override?: Partial<MockOrderItem>,
): MockOrderItem => ({
  id: 'order-item-1',
  orderId: TEST_ORDER_ID,
  productId: TEST_PRODUCT_ID,
  sizeId: 1,
  price: 10000,
  quantity: 2,
  isReviewed: false,
  createdAt: testDate,
  updatedAt: testDate,
  product: createMockProduct(),
  size: createMockSize(),
  ...override,
});

/**
 * Payment Mock 데이터
 */
export interface MockPayment {
  id: string;
  orderId: string;
  price: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createMockPayment = (testDate: Date, override?: Partial<MockPayment>): MockPayment => ({
  id: 'payment-1',
  orderId: TEST_ORDER_ID,
  price: 20000,
  status: 'COMPLETED',
  createdAt: testDate,
  updatedAt: testDate,
  ...override,
});

/**
 * Order Mock 데이터 (Repository에서 반환하는 형태)
 */
export interface MockOrder {
  id: string;
  userId: string;
  name: string;
  address: string;
  phoneNumber: string;
  subtotal: number;
  totalQuantity: number;
  usePoint: number;
  createdAt: Date;
  updatedAt: Date;
  items: MockOrderItem[];
  payments: MockPayment[];
}

export const createMockOrder = (testDate: Date, override?: Partial<MockOrder>): MockOrder => ({
  id: TEST_ORDER_ID,
  userId: TEST_USER_ID,
  name: '홍길동',
  address: '서울시 강남구 테헤란로 123',
  phoneNumber: '010-1234-5678',
  subtotal: 20000,
  totalQuantity: 2,
  usePoint: 0,
  createdAt: testDate,
  updatedAt: testDate,
  items: [createMockOrderItem(testDate)],
  payments: [createMockPayment(testDate)],
  ...override,
});
