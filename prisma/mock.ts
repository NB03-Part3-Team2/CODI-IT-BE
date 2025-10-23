// Mock 데이터만 정의 (삽입 로직은 seed.ts에서 처리)

// 사용자 등급 데이터
export const GRADES = [
  {
    name: 'Green',
    rate: 0.01, // 1%
    minAmount: 0,
  },
  {
    name: 'Orange',
    rate: 0.02, // 2%
    minAmount: 100000,
  },
  {
    name: 'Red',
    rate: 0.03, // 3%
    minAmount: 300000,
  },
  {
    name: 'Black',
    rate: 0.05, // 5%
    minAmount: 500000,
  },
  {
    name: 'VIP',
    rate: 0.07, // 7%
    minAmount: 1000000,
  },
];

// 사용자 데이터
export const USERS = [
  {
    name: '김구매',
    email: 'buyer1@example.com',
    password: 'password1',
    type: 'BUYER',
    points: 5000,
    image: 'https://example.com/avatar1.jpg',
    totalAmount: 150000,
  },
  {
    name: '이구매',
    email: 'buyer2@example.com',
    password: 'password2',
    type: 'BUYER',
    points: 12000,
    image: 'https://example.com/avatar2.jpg',
    totalAmount: 800000,
  },
  {
    name: '박판매',
    email: 'seller1@example.com',
    password: 'password3',
    type: 'SELLER',
    points: 0,
    image: 'https://example.com/avatar3.jpg',
    totalAmount: 0,
  },
  {
    name: '최판매',
    email: 'seller2@example.com',
    password: 'password4',
    type: 'SELLER',
    points: 0,
    image: 'https://example.com/avatar4.jpg',
    totalAmount: 0,
  },
];

// 스토어 데이터
export const STORES = [
  {
    name: '패션스토어',
    address: '서울시 강남구 테헤란로 123',
    detailAddress: '456호',
    phoneNumber: '02-1234-5678',
    content: '트렌디한 패션 아이템을 판매하는 스토어입니다.',
    image: 'https://example.com/store1.jpg',
  },
  {
    name: '뷰티샵',
    address: '서울시 서초구 서초대로 456',
    detailAddress: '789호',
    phoneNumber: '02-2345-6789',
    content: '고품질 뷰티 제품을 판매하는 스토어입니다.',
    image: 'https://example.com/store2.jpg',
  },
];

// 카테고리 데이터
export const CATEGORIES = [
  {
    name: 'TOP',
  },
  {
    name: 'BOTTOM',
  },
  {
    name: 'DRESS',
  },
  {
    name: 'OUTER',
  },
  {
    name: 'SKIRT',
  },
  {
    name: 'SHOES',
  },
  {
    name: 'ACC',
  },
];

// 사이즈 데이터
export const SIZES = [
  { en: 'Free', ko: '프리' },
  { en: 'XS', ko: 'XS' },
  { en: 'S', ko: 'S' },
  { en: 'M', ko: 'M' },
  { en: 'L', ko: 'L' },
  { en: 'XL', ko: 'XL' },
];

// 상품 데이터
export const PRODUCTS = [
  {
    name: '기본 반팔 티셔츠',
    content: '편안한 착용감의 기본 반팔 티셔츠입니다.',
    image: 'https://example.com/product1.jpg',
    price: 25000,
    discountPrice: 20000,
    discountRate: 20,
    discountStartTime: new Date('2024-01-01'),
    discountEndTime: new Date('2024-12-31'),
  },
  {
    name: '데님 청바지',
    content: '클래식한 스타일의 데님 청바지입니다.',
    image: 'https://example.com/product2.jpg',
    price: 80000,
    discountPrice: null,
    discountRate: 0,
    discountStartTime: null,
    discountEndTime: null,
  },
  {
    name: '립스틱',
    content: '지속력이 뛰어난 립스틱입니다.',
    image: 'https://example.com/product3.jpg',
    price: 35000,
    discountPrice: 28000,
    discountRate: 20,
    discountStartTime: new Date('2024-01-01'),
    discountEndTime: new Date('2024-06-30'),
  },
  {
    name: '아이섀도',
    content: '자연스러운 색감의 아이섀도입니다.',
    image: 'https://example.com/product4.jpg',
    price: 45000,
    discountPrice: null,
    discountRate: 0,
    discountStartTime: null,
    discountEndTime: null,
  },
];

// 재고 데이터 (상품과 사이즈 인덱스 기반)
export const STOCKS = [
  { productIndex: 0, sizeIndex: 2, quantity: 50 }, // 첫 번째 상품, S 사이즈
  { productIndex: 0, sizeIndex: 3, quantity: 30 }, // 첫 번째 상품, M 사이즈
  { productIndex: 0, sizeIndex: 4, quantity: 20 }, // 첫 번째 상품, L 사이즈
  { productIndex: 1, sizeIndex: 2, quantity: 25 }, // 두 번째 상품, S 사이즈
  { productIndex: 1, sizeIndex: 3, quantity: 35 }, // 두 번째 상품, M 사이즈
  { productIndex: 1, sizeIndex: 4, quantity: 15 }, // 두 번째 상품, L 사이즈
  { productIndex: 2, sizeIndex: 0, quantity: 100 }, // 세 번째 상품, Free 사이즈
  { productIndex: 3, sizeIndex: 0, quantity: 80 }, // 네 번째 상품, Free 사이즈
];

// 장바구니 아이템 데이터 (사용자와 상품 인덱스 기반)
export const CART_ITEMS = [
  { userIndex: 0, productIndex: 0, sizeIndex: 3, quantity: 2 }, // 첫 번째 사용자, 첫 번째 상품, M 사이즈
  { userIndex: 0, productIndex: 2, sizeIndex: 0, quantity: 1 }, // 첫 번째 사용자, 세 번째 상품, Free 사이즈
  { userIndex: 1, productIndex: 1, sizeIndex: 3, quantity: 1 }, // 두 번째 사용자, 두 번째 상품, M 사이즈
];

// 주문 데이터 (사용자와 스토어 인덱스 기반)
export const ORDERS = [
  {
    userIndex: 0,
    storeIndex: 0,
    name: '김구매',
    address: '서울시 강남구 테헤란로 123',
    phoneNumber: '010-1234-5678',
    subtotal: 40000,
    totalQuantity: 2,
    usePoint: 2000,
  },
  {
    userIndex: 1,
    storeIndex: 1,
    name: '이구매',
    address: '서울시 서초구 서초대로 456',
    phoneNumber: '010-2345-6789',
    subtotal: 35000,
    totalQuantity: 1,
    usePoint: 0,
  },
];

// 주문 아이템 데이터 (주문과 상품 인덱스 기반)
export const ORDER_ITEMS = [
  { orderIndex: 0, productIndex: 0, sizeIndex: 3, price: 20000, quantity: 2, isReviewed: false },
  { orderIndex: 1, productIndex: 2, sizeIndex: 0, price: 28000, quantity: 1, isReviewed: true },
];

// 결제 데이터 (주문 인덱스 기반)
export const PAYMENTS = [
  { orderIndex: 0, price: 38000, status: 'COMPLETED' },
  { orderIndex: 1, price: 35000, status: 'COMPLETED' },
];

// 리뷰 데이터 (사용자, 상품, 주문 아이템 인덱스 기반)
export const REVIEWS = [
  {
    userIndex: 1,
    productIndex: 2,
    orderItemIndex: 1,
    content: '색상이 정말 예뻐요! 지속력도 좋습니다.',
    rating: 5,
  },
];

// 문의 데이터 (사용자와 상품 인덱스 기반)
export const INQUIRIES = [
  {
    userIndex: 0,
    productIndex: 0,
    title: '사이즈 문의',
    content: 'M 사이즈가 어떤가요?',
    status: 'WAITING_ANSWER' as const,
    isSecret: false,
  },
  {
    userIndex: 1,
    productIndex: 1,
    title: '배송 문의',
    content: '언제 배송되나요?',
    status: 'COMPLETED_ANSWER' as const,
    isSecret: false,
  },
];

// 문의 답변 데이터 (문의와 사용자 인덱스 기반)
export const INQUIRY_REPLIES = [
  {
    inquiryIndex: 1,
    userIndex: 2, // 판매자
    content: '2-3일 내에 배송됩니다.',
  },
];

// 알림 데이터 (사용자 인덱스 기반)
export const NOTIFICATIONS = [
  {
    userIndex: 0,
    content: '주문이 완료되었습니다.',
    isChecked: false,
  },
  {
    userIndex: 1,
    content: '리뷰 작성이 완료되었습니다.',
    isChecked: true,
  },
];

// 스토어 좋아요 데이터 (사용자와 스토어 인덱스 기반)
export const STORE_LIKES = [
  { userIndex: 0, storeIndex: 0 },
  { userIndex: 1, storeIndex: 1 },
];