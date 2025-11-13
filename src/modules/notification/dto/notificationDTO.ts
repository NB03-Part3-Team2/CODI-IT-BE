// 알림 타입
export type NotificationType =
  | 'OUT_OF_STOCK' // 품절
  | 'CART_ITEM_OUT_OF_STOCK' // 장바구니 상품 품절
  | 'NEW_INQUIRY' // 새 문의
  | 'INQUIRY_ANSWERED'; // 문의 답변

export interface CreateNotificationDto {
  userId: string;
  content: string;
}

export interface ResNotificationDto {
  id: string;
  userId: string;
  content: string;
  isChecked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
