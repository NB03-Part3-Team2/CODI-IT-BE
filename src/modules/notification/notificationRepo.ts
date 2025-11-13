import { prisma } from '@shared/prisma';
import {
  CreateNotificationDto,
  ResNotificationDto,
} from '@modules/notification/dto/notificationDTO';

class NotificationRepository {
  /**
   * 알림 생성
   */
  async create(data: CreateNotificationDto): Promise<ResNotificationDto> {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        content: data.content,
        isChecked: false,
      },
    });
  }

  /**
   * 사용자별 알림 목록 조회
   */
  async getNotificationList(userId: string): Promise<ResNotificationDto[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 알림 읽음 처리
   */
  async markAsRead(notificationId: string): Promise<ResNotificationDto> {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isChecked: true },
    });
  }

  /**
   * 알림 조회 (단건)
   */
  async getNotificationById(notificationId: string): Promise<ResNotificationDto | null> {
    return prisma.notification.findUnique({
      where: { id: notificationId },
    });
  }
}

export default new NotificationRepository();
