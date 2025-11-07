import { z } from 'zod';

const idChecker = z.cuid({ message: 'ID는 CUID 형식이어야 합니다.' });

// 주문 아이템 요청 스키마
const orderItemRequestSchema = z.object({
  productId: idChecker,
  sizeId: z.number().int().positive('사이즈 ID는 양의 정수여야 합니다.'),
  quantity: z.number().int().positive('수량은 양의 정수여야 합니다.'),
});

// 주문 생성 요청 스키마
export const createOrderSchema = z.object({
  name: z.string().min(1, '주문자 이름은 필수입니다.'),
  phone: z.string().min(1, '전화번호는 필수입니다.'),
  address: z.string().min(1, '주소는 필수입니다.'),
  orderItems: z.array(orderItemRequestSchema).min(1, '최소 하나의 주문 아이템이 필요합니다.'),
  usePoint: z.number().int().nonnegative('사용 포인트는 0 이상이어야 합니다.').default(0),
});

// 주문 생성 요청 DTO
export type CreateOrderDto = z.infer<typeof createOrderSchema>;

// 주문 아이템 요청 DTO
export type OrderItemRequestDto = z.infer<typeof orderItemRequestSchema>;

// 주문 생성 응답 DTO
export interface CreateOrderResponseDto {
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
  orderItems: OrderItemResponseDto[];
  payments: PaymentResponseDto;
}

export interface OrderItemResponseDto {
  id: string;
  orderId: string;
  productId: string;
  sizeId: number;
  price: number;
  quantity: number;
  isReviewed: boolean;
  createdAt: Date;
  updatedAt: Date;
  product: ProductInOrderDto;
  size: SizeInOrderDto;
}

export interface ProductInOrderDto {
  id: string;
  name: string;
  image: string | null;
}

export interface SizeInOrderDto {
  id: number;
  size: {
    en: string;
    ko: string;
  };
}

export interface PaymentResponseDto {
  id: string;
  orderId: string;
  price: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Repository 레이어에서 사용하는 주문 생성 데이터 타입
export interface CreateOrderData {
  userId: string;
  name: string;
  address: string;
  phoneNumber: string;
  subtotal: number;
  totalQuantity: number;
  usePoint: number;
}

// Repository 레이어에서 사용하는 주문 아이템 생성 데이터 타입
export interface CreateOrderItemData {
  productId: string;
  sizeId: number;
  price: number;
  quantity: number;
}
