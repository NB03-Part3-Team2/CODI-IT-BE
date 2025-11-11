import { InquiryStatus } from '@prisma/client';

export const mockUser = {
  id: 'user-id-123',
  name: '테스트 사용자',
  email: 'test@example.com',
};

export const mockProduct = {
  id: 'product-id-456',
  name: '테스트 상품',
  storeId: 'store-id-789',
  categoryId: 'category-id-101',
  content: '상품 내용',
  price: 10000,
  discountRate: 0,
  image: null,
  discountPrice: null,
  discountStartTime: null,
  discountEndTime: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockInquiryList = [
  {
    id: 'inquiry-id-001',
    userId: 'user-id-123',
    productId: mockProduct.id,
    title: '테스트 문의 1',
    content: '문의 내용 1',
    status: InquiryStatus.WAITING_ANSWER,
    isSecret: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { name: '사용자 1' },
    reply: null,
  },
  {
    id: 'inquiry-id-002',
    userId: 'user-id-456',
    productId: mockProduct.id,
    title: '테스트 문의 2',
    content: '문의 내용 2',
    status: InquiryStatus.COMPLETED_ANSWER,
    isSecret: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { name: '사용자 2' },
    reply: {
      id: 'reply-id-001',
      inquiryId: 'inquiry-id-002',
      userId: 'store-user-id-789',
      content: '답변 내용',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { name: '스토어 사용자' },
    },
  },
];
