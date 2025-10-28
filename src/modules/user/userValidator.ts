import type { RequestHandler } from 'express';
import { forwardZodError } from '@utils/zod';
import { CreatedUserSchema } from '@modules/user/dto/userDTO';

class UserValidator {
  validateUserCreate: RequestHandler = async (req, res, next) => {
    try {
      const parsedBody = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        type: req.body.type,
      };
      await CreatedUserSchema.parseAsync(parsedBody);
      next();
    } catch (err) {
      forwardZodError(err, '사용자 생성', next);
    }
  };
}

export default new UserValidator();
