import type { RequestHandler } from 'express';
import tokenUtils from '@modules/auth/utils/tokenUtils';
import { ApiError } from '@errors/ApiError';

/**
 * JWT 인증 미들웨어
 *
 * Authorization 헤더에서 Bearer 토큰을 추출하고 검증한 후,
 * 사용자 ID를 req.user 객체에 설정합니다.
 *
 * @description
 * - Authorization 헤더에서 "Bearer {token}" 형식의 JWT 토큰을 추출
 * - JWT 토큰의 유효성을 검증
 * - 토큰에서 사용자 ID를 디코딩하여 req.user.id에 저장
 * - 인증이 필요한 라우트에서 사용
 *
 * @throws {ApiError} 401 - 토큰이 존재하지 않는 경우
 * @throws {ApiError} 403 - 토큰이 유효하지 않거나 만료된 경우
 *
 * @example
 * // 단일 라우트에 적용
 * router.get('/profile', authMiddleware, (req, res) => {
 *   const userId = req.user.id; // 인증된 사용자 ID
 *   // 사용자 프로필 조회 로직
 * });
 *
 * @example
 * // 여러 라우트에 적용
 * router.use('/protected', authMiddleware); // 이후 모든 라우트에 인증 적용
 * router.get('/protected/data', (req, res) => {
 *   const userId = req.user.id; // 자동으로 사용 가능
 * });
 *
 * @example
 * // 컨트롤러에서 사용자 ID 접근
 * export const getUserProfile = async (req: Request, res: Response) => {
 *   const userId = req.user.id; // authMiddleware에서 설정된 사용자 ID
 *   const user = await userService.getUserById(userId);
 *   res.json(user);
 * };
 *
 * @example
 * // 클라이언트 요청 예시
 * fetch('/api/profile', {
 *   headers: {
 *     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *     'Content-Type': 'application/json'
 *   }
 * });
 *
 * @since 1.0.0
 */
export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) throw ApiError.unauthorized('토큰이 존재하지 않습니다.');
  const decoded = tokenUtils.verifyAccessToken(token);
  req.user = { id: decoded.id };
  next();
};
