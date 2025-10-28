import { prisma } from '@shared/prisma';
import { afterAll, afterEach, describe, test, expect, jest } from '@jest/globals';
import usersService from '@modules/users/usersService';
import usersRepository from '@modules/users/usersRepo';
import { CreateUserDto, CreatedUserDto } from '@modules/users/dto/usersDTO';
import * as passwordUtils from '@modules/auth/utils/passwordUtils';

describe('usersService 단위 테스트', () => {
  // 각 테스트 후에 모든 모의(mock)를 복원합니다.
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createUser 메소드 테스트', () => {
    test('createUser 성공 테스트 - mock방식', async () => {
      // 테스트에 사용할 mock 데이터를 생성합니다.
      const createUserDto: CreateUserDto = {
        name: '테스트유저',
        email: 'test@example.com',
        password: 'password123',
        type: 'BUYER',
      };

      const hashedPassword = 'hashedPassword123';
      const originalPassword = createUserDto.password; // 원본 비밀번호 저장

      const mockCreatedUser: CreatedUserDto = {
        id: 'user123',
        gradeId: 'grade123',
        name: '테스트유저',
        email: 'test@example.com',
        password: hashedPassword,
        type: 'BUYER',
        points: 0,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        totalAmount: 0,
        grade: {
          id: 'grade123',
          name: 'Green',
          rate: 0.01,
          minAmount: 0,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        image: null,
      };

      const expectedResult = {
        id: 'user123',
        name: '테스트유저',
        email: 'test@example.com',
        type: 'BUYER',
        points: 0,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        grade: {
          id: 'grade123',
          name: 'Green',
          rate: 0.01,
          minAmount: 0,
        },
        image: null,
      };

      // Repository 메소드들을 mock합니다.
      //prettier-ignore
      const getUserByEmailMock = jest.spyOn(usersRepository, 'getUserByEmail').mockResolvedValue(null);
      const getUserByNameMock = jest
        .spyOn(usersRepository, 'getUserByName')
        .mockResolvedValue(null);
      const createUserMock = jest
        .spyOn(usersRepository, 'createUser')
        .mockResolvedValue(mockCreatedUser);

      const hashPasswordMock = jest
        .spyOn(passwordUtils, 'hashPassword')
        .mockResolvedValue(hashedPassword);
      const result = await usersService.createUser(createUserDto);

      // Mock된 메소드들이 올바른 인자와 함께 호출되었는지 확인합니다.
      expect(getUserByEmailMock).toHaveBeenCalledWith(createUserDto.email);
      expect(getUserByNameMock).toHaveBeenCalledWith(createUserDto.name);
      expect(hashPasswordMock).toHaveBeenCalledWith(originalPassword); // 원본 비밀번호 사용
      expect(createUserMock).toHaveBeenCalledWith({
        name: '테스트유저',
        email: 'test@example.com',
        password: hashedPassword, // 해시된 비밀번호
        type: 'BUYER',
      });
      expect(result).toEqual(expectedResult);
    });

    test('createUser 실패 테스트 - 이메일 중복', async () => {
      const createUserDto: CreateUserDto = {
        name: '테스트유저',
        email: 'test@example.com',
        password: 'password123',
        type: 'BUYER',
      };

      const existingUser = {
        id: 'existing123',
        email: 'test@example.com',
        name: '기존유저',
        type: 'BUYER' as const,
        password: 'hashedPassword',
        gradeId: 'grade123',
        points: 0,
        image: null,
        totalAmount: 0,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        grade: {
          id: 'grade123',
          name: 'Green',
          rate: 0.01,
          minAmount: 0,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      };

      // 이미 존재하는 이메일을 mock합니다.
      const getUserByEmailMock = jest
        .spyOn(usersRepository, 'getUserByEmail')
        .mockResolvedValue(existingUser);

      // 에러가 발생하는지 확인합니다.
      await expect(usersService.createUser(createUserDto)).rejects.toMatchObject({
        code: 409,
        message: '이미 존재하는 이메일입니다.',
      });

      // getUserByEmail이 호출되었는지 확인합니다.
      expect(getUserByEmailMock).toHaveBeenCalledWith(createUserDto.email);
    });

    test('createUser 실패 테스트 - 이름 중복', async () => {
      const createUserDto: CreateUserDto = {
        name: '테스트유저',
        email: 'test@example.com',
        password: 'password123',
        type: 'BUYER',
      };

      const existingUser = {
        id: 'existing123',
        email: 'existing@example.com',
        name: '테스트유저',
        type: 'BUYER' as const,
        password: 'hashedPassword',
        gradeId: 'grade123',
        points: 0,
        image: null,
        totalAmount: 0,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      // 이메일은 중복되지 않도록 mock합니다.
      const getUserByEmailMock = jest
        .spyOn(usersRepository, 'getUserByEmail')
        .mockResolvedValue(null);
      // 이미 존재하는 이름을 mock합니다.
      const getUserByNameMock = jest
        .spyOn(usersRepository, 'getUserByName')
        .mockResolvedValue(existingUser);

      // 에러가 발생하는지 확인합니다.
      await expect(usersService.createUser(createUserDto)).rejects.toMatchObject({
        code: 409,
        message: '이미 존재하는 이름입니다.',
      });

      // 메소드들이 호출되었는지 확인합니다.
      expect(getUserByEmailMock).toHaveBeenCalledWith(createUserDto.email);
      expect(getUserByNameMock).toHaveBeenCalledWith(createUserDto.name);
    });

    test('createUser 실패 테스트 - 사용자 생성 실패', async () => {
      const createUserDto: CreateUserDto = {
        name: '테스트유저',
        email: 'test@example.com',
        password: 'password123',
        type: 'BUYER',
      };

      const hashedPassword = 'hashedPassword123';
      const originalPassword = createUserDto.password; // 원본 비밀번호 저장

      // Repository 메소드들을 mock합니다.
      const getUserByEmailMock = jest
        .spyOn(usersRepository, 'getUserByEmail')
        .mockResolvedValue(null);
      const getUserByNameMock = jest
        .spyOn(usersRepository, 'getUserByName')
        .mockResolvedValue(null);
      const createUserMock = jest
        .spyOn(usersRepository, 'createUser')
        .mockResolvedValue(null as any);

      // Password hash 함수를 mock합니다.
      const hashPasswordMock = jest
        .spyOn(passwordUtils, 'hashPassword')
        .mockResolvedValue(hashedPassword);

      // 에러가 발생하는지 확인합니다.
      await expect(usersService.createUser(createUserDto)).rejects.toMatchObject({
        code: 500,
        message: '사용자 생성에 실패했습니다.',
      });

      // Mock된 메소드들이 호출되었는지 확인합니다.
      expect(getUserByEmailMock).toHaveBeenCalledWith(createUserDto.email);
      expect(getUserByNameMock).toHaveBeenCalledWith(createUserDto.name);
      expect(hashPasswordMock).toHaveBeenCalledWith(originalPassword); // 원본 비밀번호 사용
      expect(createUserMock).toHaveBeenCalledWith({
        name: '테스트유저',
        email: 'test@example.com',
        password: hashedPassword,
        type: 'BUYER',
      });
    });
  });
});
