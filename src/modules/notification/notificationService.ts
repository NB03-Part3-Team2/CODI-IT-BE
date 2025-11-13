import notificationRepository from '@modules/notification/notificationRepo';
import notificationServer from '@modules/notification/notificationServer';
import userRepository from '@modules/user/userRepo';
import {
  CreateNotificationDto,
  ResNotificationDto,
} from '@modules/notification/dto/notificationDTO';
import { ApiError } from '@errors/ApiError';
import { assert } from '@utils/assert';

class NotificationService {
  /**
   * 알림 생성 및 실시간 전송
   */
  async create(data: CreateNotificationDto): Promise<ResNotificationDto> {
    // 1. DB에 알림 저장
    const notification = await notificationRepository.create(data);

    // 2. SSE로 실시간 전송 (연결되어 있는 경우에만)
    if (notificationServer.isConnected(data.userId)) {
      notificationServer.send(data.userId, 'notification', notification);
    }

    return notification;
  }

  /**
   * 품절 알림 전송
   */
  async notifyOutOfStock(productId: string, product: any, cartUserIds: string[]) {
    // 판매자에게 알림
    await this.create({
      userId: product.userId, // 판매자 ID
      content: `상품 "${product.name}"이 품절되었습니다.`,
    });

    // 장바구니에 담은 구매자들에게 알림
    for (const userId of cartUserIds) {
      await this.create({
        userId,
        content: `장바구니에 담긴 "${product.name}"이 품절되었습니다.`,
      });
    }
  }

  async notifyInquiryAnswered(inquiry: any) {
    await this.create({
      userId: inquiry.userId,
      content: `문의 "${inquiry.title}"에 답변이 달렸습니다.`,
    });
  }

  async notifyNewInquiry(inquiry: any, product: any) {
    await this.create({
      userId: product.userId, // 판매자 ID
      content: `상품 "${product.name}"에 새로운 문의가 등록되었습니다.`,
    });
  }

  async getNotifications(userId: string): Promise<ResNotificationDto[]> {
    return notificationRepository.getNotificationList(userId);
  }

  async markAsRead(notificationId: string, userId: string): Promise<ResNotificationDto> {
    const notification = await notificationRepository.getNotificationById(notificationId);
    const existingUser = await userRepository.getUserById(userId);
    assert(existingUser, ApiError.notFound('사용자를 찾을 수 없습니다.'));
    assert(notification, ApiError.notFound('알림을 찾을 수 없습니다.'));
    assert(
      notification.userId === userId,
      ApiError.forbidden('본인의 알림만 읽음 처리할 수 있습니다.'),
    );

    return notificationRepository.markAsRead(notificationId);
  }
}

export default new NotificationService();
