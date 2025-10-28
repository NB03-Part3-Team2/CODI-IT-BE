import { z } from 'zod';
import dns from 'dns/promises';

const emailWithMX = z.string().refine(
  async (email) => {
    const domain = email.split('@')[1];
    try {
      const records = await dns.resolveMx(domain);
      return records && records.length > 0;
    } catch {
      return false;
    }
  },
  {
    message: '유효한 이메일 주소가 아닙니다.',
  },
);

export const CreatedUserSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(10, '이름은 최대 10자 이하여야 합니다')
    .regex(/^[a-zA-Z0-9가-힣]+$/, '이름에 특수문자는 사용할 수 없습니다.'),
  email: emailWithMX,
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(20, '비밀번호는 최대 20자 이하여야 합니다'),
  type: z.enum(['BUYER', 'SELLER'], '유효하지 않은 사용자 유형입니다.'),
});

export type CreateUserDto = z.infer<typeof CreatedUserSchema>;
export type CreatedUserDto = {
  id: string;
  gradeId: string;
  name: string;
  email: string;
  password: string;
  type: 'BUYER' | 'SELLER';
  points: number;
  createdAt: Date;
  updatedAt: Date;
  totalAmount: number;
  grade: {
    name: string;
    id: string;
    rate: number;
    minAmount: number;
    createdAt: Date;
    updatedAt: Date;
  };
  image: string | null;
};
