// import jwt from 'jsonwebtoken';
// import type { DecodedToken } from '#modules/auth/dto/token.dto';
// import type { AuthHeaderDto } from '#modules/auth/dto/token.dto';
// import ApiError from '#errors/ApiError';

// const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
// const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

// if (!ACCESS_SECRET || !REFRESH_SECRET) throw new Error('❌ Invalid ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET');

// const extractToken = (authHeader: AuthHeaderDto): string => {
//   if (!authHeader.authorization.startsWith('Bearer ')) throw ApiError.unauthorized('토큰 형식이 올바르지 않습니다.');
//   return authHeader.authorization.slice(7);
// };

// const generateAccessToken = (user: { id: number }): string => {
//   try {
//     return jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: '1h' });
//   } catch (err) {
//     throw new ApiError(500, '❌ Access Token 생성에 실패했습니다.');
//   }
// };

// const verifyAccessToken = (token: string): DecodedToken => {
//   try {
//     return jwt.verify(token, ACCESS_SECRET) as DecodedToken;
//   } catch {
//     throw new ApiError(403, '❌ Access Token이 유효하지 않습니다.');
//   }
// };

// const generateRefreshToken = (user: { id: number }): string => {
//   try {
//     return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '14d' });
//   } catch (err) {
//     throw new ApiError(500, '❌ Refresh Token 생성에 실패했습니다.');
//   }
// };

// const verifyRefreshToken = (token: string): DecodedToken => {
//   try {
//     return jwt.verify(token, REFRESH_SECRET) as DecodedToken;
//   } catch {
//     throw new ApiError(403, '❌ Refresh Token이 유효하지 않습니다.');
//   }
// };

// export default {
//   extractToken,
//   generateAccessToken,
//   verifyAccessToken,
//   generateRefreshToken,
//   verifyRefreshToken,
// };
