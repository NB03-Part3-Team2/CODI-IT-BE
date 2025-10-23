// import type { RequestHandler } from 'express';
// import tokenUtils from '#modules/auth/utils/tokenUtils';
// import { ApiError }  from '../errors/ApiError';

// export const authMiddleware: RequestHandler = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

//   if (!token) throw ApiError.unauthorized('토큰이 존재하지 않습니다.');

//   const decoded = tokenUtils.verifyAccessToken(token);

//   req.user = { id: decoded.id };

//   next();
// };
