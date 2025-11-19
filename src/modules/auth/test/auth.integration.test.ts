// import { beforeAll, describe, test, expect } from '@jest/globals';
// import request from 'supertest';
// import { app } from '../../../app';
// import { prisma } from '@shared/prisma';
// import { hashPassword } from '@modules/auth/utils/passwordUtils';

// describe('유저 인증 API 테스트', () => {
//   let AccessToken: string = '';

//   beforeAll(async () => {
//     const hashedPassword = await hashPassword('password123');

//     await prisma.user.upsert({
//       where: { email: 'testuser@example.com' },
//       update: { password: hashedPassword },
//       create: {
//         email: 'testuser@example.com',
//         password: hashedPassword,
//       },
//     });
//   });
// });
