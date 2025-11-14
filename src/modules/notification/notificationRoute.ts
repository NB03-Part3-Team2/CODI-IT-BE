import { Router } from 'express';
import notificationController from '@modules/notification/notificationController';
import { authMiddleware } from '@middlewares/authMiddleware';

const router = Router();

// SSE 연결 (임시로 인증 제거 - 테스트용)
router.get('/sse', authMiddleware, notificationController.connectSSE);
router.get('/', authMiddleware, notificationController.getNotificationList);
router.patch('/:alarmId/check', authMiddleware, notificationController.markAsRead);

export default router;
