import { CreateReviewDto } from '@modules/review/dto/reviewDTO';

// 공통 상수
export const MOCK_CONSTANTS = {
  REVIEW_ID: 'review123',
  USER_ID: 'user123',
  PRODUCT_ID: 'product123',
  ORDER_ITEM_ID: 'orderItem123',
  RATING: 5,
  CONTENT: '정말 좋은 상품이에요! 추천합니다.',
  MOCK_DATE: new Date('2024-01-01'),
  USER_NAME: '테스트유저',
  USER_EMAIL: 'test@example.com',
  GRADE_ID: 'grade123',
} as const;

// 기본 객체들
const baseUser = {
  id: MOCK_CONSTANTS.USER_ID,
  gradeId: MOCK_CONSTANTS.GRADE_ID,
  name: MOCK_CONSTANTS.USER_NAME,
  email: MOCK_CONSTANTS.USER_EMAIL,
  password: 'hashedPassword',
  points: 0,
  totalAmount: 0,
  type: 'BUYER',
  image: null,
  createdAt: MOCK_CONSTANTS.MOCK_DATE,
  updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  grade: {
    id: MOCK_CONSTANTS.GRADE_ID,
    name: 'Green',
    rate: 1,
    minAmount: 0,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  },
} as const;

const baseProduct = {
  id: MOCK_CONSTANTS.PRODUCT_ID,
  name: '테스트 상품',
  price: 10000,
  stockQuantity: 100,
  createdAt: MOCK_CONSTANTS.MOCK_DATE,
  updatedAt: MOCK_CONSTANTS.MOCK_DATE,
} as const;

const baseReview = {
  id: MOCK_CONSTANTS.REVIEW_ID,
  userId: MOCK_CONSTANTS.USER_ID,
  productId: MOCK_CONSTANTS.PRODUCT_ID,
  rating: MOCK_CONSTANTS.RATING,
  content: MOCK_CONSTANTS.CONTENT,
  createdAt: MOCK_CONSTANTS.MOCK_DATE,
} as const;

// 미리 정의된 mock 데이터들
export const MOCK_DATA = {
  // 기본 리뷰 생성 DTO
  createReviewDto: {
    userId: MOCK_CONSTANTS.USER_ID,
    productId: MOCK_CONSTANTS.PRODUCT_ID,
    orderItemId: MOCK_CONSTANTS.ORDER_ITEM_ID,
    rating: MOCK_CONSTANTS.RATING,
    content: MOCK_CONSTANTS.CONTENT,
  } as CreateReviewDto,

  // 기본 생성된 리뷰
  createdReview: baseReview,

  // 기본 응답용 리뷰
  resReview: {
    id: MOCK_CONSTANTS.REVIEW_ID,
    userId: MOCK_CONSTANTS.USER_ID,
    productId: MOCK_CONSTANTS.PRODUCT_ID,
    rating: MOCK_CONSTANTS.RATING,
    content: MOCK_CONSTANTS.CONTENT,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
  },

  // 사용자 데이터
  existingUser: baseUser,

  // 상품 데이터
  existingProduct: baseProduct,

  // 유효하지 않은 별점 (0점)
  invalidRatingZero: {
    userId: MOCK_CONSTANTS.USER_ID,
    productId: MOCK_CONSTANTS.PRODUCT_ID,
    orderItemId: MOCK_CONSTANTS.ORDER_ITEM_ID,
    rating: 0,
    content: MOCK_CONSTANTS.CONTENT,
  } as CreateReviewDto,

  // 유효하지 않은 별점 (6점)
  invalidRatingSix: {
    userId: MOCK_CONSTANTS.USER_ID,
    productId: MOCK_CONSTANTS.PRODUCT_ID,
    orderItemId: MOCK_CONSTANTS.ORDER_ITEM_ID,
    rating: 6,
    content: MOCK_CONSTANTS.CONTENT,
  } as CreateReviewDto,

  // 너무 짧은 내용
  shortContent: {
    userId: MOCK_CONSTANTS.USER_ID,
    productId: MOCK_CONSTANTS.PRODUCT_ID,
    orderItemId: MOCK_CONSTANTS.ORDER_ITEM_ID,
    rating: MOCK_CONSTANTS.RATING,
    content: '짧음',
  } as CreateReviewDto,
};
