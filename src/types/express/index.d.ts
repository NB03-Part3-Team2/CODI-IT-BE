import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user: Pick<User, 'id'>;
      validatedBody?: any; // ✅ 초기에는 이렇게
      validatedQuery?: any;
      validatedParams?: any;
    }
  }
}

export {};
