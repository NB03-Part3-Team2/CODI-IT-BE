import { Request, Response } from 'express';
import authService from '@modules/auth/authService';
import type { LoginDto } from '@modules/auth/dto/loginDTO';

class AuthController {
  /**
   * 로그인 요청을 처리합니다.
   * 로그인을 시도하는 사용자의 이메일과 비밀번호를 받아 인증을 수행합니다.
   * 인증에 성공하면 액세스 토큰과 사용자 정보를 반환합니다.
   *
   * @param req - Express 요청 객체
   * @param res - Express 응답 객체
   *
   * @returns {Object} 사용자 정보와 액세스 토큰
   * @throws {ApiError} 400 - 잘못된 요청 데이터
   * @throws {ApiError} 401 - 인증 실패 (잘못된 이메일 또는 비밀번호)
   * @throws {ApiError} 500 - 서버 내부 오류
   */

  login = async (req: Request, res: Response) => {
    const loginDto: LoginDto = {
      email: req.body.email,
      password: req.body.password,
    };
    const tokens = await authService.login(loginDto);
    res.json(tokens);
  };
}

export default new AuthController();
