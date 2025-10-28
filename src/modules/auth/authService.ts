import usersService from '@modules/users/usersService';
import tokenUtils from '@modules/auth/utils/tokenUtils';
import { isPasswordValid } from './utils/passwordUtils';
import { ApiError } from '@errors/ApiError';
import type { LoginDto } from '@modules/auth/dto/loginDTO';

class AuthService {
  login = async (loginDto: LoginDto) => {
    const message = '사용자 또는 비밀번호가 올바르지 않습니다.';
    const user = await usersService.getUserByEmail(loginDto.email);
    if (!user) throw ApiError.notFound(message);

    const isValid = await isPasswordValid(loginDto.password, user.password);
    if (!isValid) throw ApiError.unauthorized(message);
    const accessToken = tokenUtils.generateAccessToken({ id: user.id });

    const data = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        points: user.points,
        image: user.image ?? null,
        grade: {
          id: user.grade.id,
          name: user.grade.name,
          discountRate: user.grade.rate,
          minAmount: user.grade.minAmount,
        },
      },
      accessToken,
    };
    return data;
  };
}

export default new AuthService();
