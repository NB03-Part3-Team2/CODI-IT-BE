import {
  CreateNotificationDto,
  ResnotifyOutOfStockDto,
} from '@modules/notification/dto/notificationDTO';

// 공통 상수
export const MOCK_CONSTANTS = {
  NOTIFICATION_ID: 'notif123',
  NOTIFICATION_ID_2: 'notif456',
  USER_ID: 'user123',
  OTHER_USER_ID: 'user456',
  SELLER_ID: 'seller123',
  BUYER_ID_1: 'buyer1',
  BUYER_ID_2: 'buyer2',
  STORE_NAME: '코디잇 스토어',
  PRODUCT_NAME: '반팔티',
  SIZE_NAME: 'M',
  INQUIRY_TITLE: '배송 문의',
  MOCK_DATE: new Date('2024-01-01'),
} as const;

// 미리 정의된 mock 데이터들
export const MOCK_DATA = {
  // 기본 알림 생성 DTO
  createNotificationDto: {
    userId: MOCK_CONSTANTS.USER_ID,
    content: '테스트 알림입니다.',
  } as CreateNotificationDto,

  // 생성된 알림 응답
  createdNotification: {
    id: MOCK_CONSTANTS.NOTIFICATION_ID,
    userId: MOCK_CONSTANTS.USER_ID,
    content: '테스트 알림입니다.',
    isChecked: false,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  },

  // 품절 알림 DTO
  outOfStockDto: {
    sellerId: MOCK_CONSTANTS.SELLER_ID,
    storeName: MOCK_CONSTANTS.STORE_NAME,
    productName: MOCK_CONSTANTS.PRODUCT_NAME,
    sizeName: MOCK_CONSTANTS.SIZE_NAME,
    cartUserIds: [MOCK_CONSTANTS.BUYER_ID_1, MOCK_CONSTANTS.BUYER_ID_2],
  } as ResnotifyOutOfStockDto,

  // 장바구니 유저 없는 품절 알림 DTO
  outOfStockDtoNoCart: {
    sellerId: MOCK_CONSTANTS.SELLER_ID,
    storeName: MOCK_CONSTANTS.STORE_NAME,
    productName: MOCK_CONSTANTS.PRODUCT_NAME,
    sizeName: MOCK_CONSTANTS.SIZE_NAME,
    cartUserIds: [],
  } as ResnotifyOutOfStockDto,

  // 판매자 품절 알림
  sellerOutOfStockNotification: {
    id: 'notif-seller',
    userId: MOCK_CONSTANTS.SELLER_ID,
    content: `${MOCK_CONSTANTS.STORE_NAME}에서 ${MOCK_CONSTANTS.PRODUCT_NAME} ${MOCK_CONSTANTS.SIZE_NAME} 사이즈가 품절되었습니다.`,
    isChecked: false,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  },

  // 구매자 품절 알림
  buyerOutOfStockNotification: {
    id: 'notif-buyer',
    userId: MOCK_CONSTANTS.BUYER_ID_1,
    content: `장바구니에 담긴 "${MOCK_CONSTANTS.PRODUCT_NAME} ${MOCK_CONSTANTS.SIZE_NAME} 사이즈가 품절되었습니다.`,
    isChecked: false,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  },

  // 문의 답변 알림
  inquiryAnsweredNotification: {
    id: 'notif-inquiry',
    userId: MOCK_CONSTANTS.USER_ID,
    content: `등록한 문의 "${MOCK_CONSTANTS.INQUIRY_TITLE}"에 답변이 달렸습니다.`,
    isChecked: false,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  },

  // 새 문의 알림
  newInquiryNotification: {
    id: 'notif-new-inquiry',
    userId: MOCK_CONSTANTS.SELLER_ID,
    content: `등록된 상품:${MOCK_CONSTANTS.PRODUCT_NAME}에 새로운 문의가 등록되었습니다.`,
    isChecked: false,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  },

  // 알림 목록 (여러 개)
  notificationList: [
    {
      id: MOCK_CONSTANTS.NOTIFICATION_ID,
      userId: MOCK_CONSTANTS.USER_ID,
      content: '테스트 알림 1',
      isChecked: false,
      createdAt: MOCK_CONSTANTS.MOCK_DATE,
      updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    },
    {
      id: MOCK_CONSTANTS.NOTIFICATION_ID_2,
      userId: MOCK_CONSTANTS.USER_ID,
      content: '테스트 알림 2',
      isChecked: true,
      createdAt: MOCK_CONSTANTS.MOCK_DATE,
      updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    },
  ],

  // 빈 알림 목록
  emptyNotificationList: [],

  // 읽음 처리할 알림
  unreadNotification: {
    id: MOCK_CONSTANTS.NOTIFICATION_ID,
    userId: MOCK_CONSTANTS.USER_ID,
    content: '읽지 않은 알림',
    isChecked: false,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  },

  // 읽음 처리된 알림
  readNotification: {
    id: MOCK_CONSTANTS.NOTIFICATION_ID,
    userId: MOCK_CONSTANTS.USER_ID,
    content: '읽지 않은 알림',
    isChecked: true,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  },

  // 다른 사용자의 알림
  otherUserNotification: {
    id: MOCK_CONSTANTS.NOTIFICATION_ID,
    userId: MOCK_CONSTANTS.OTHER_USER_ID,
    content: '다른 사용자의 알림',
    isChecked: false,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  },
};
