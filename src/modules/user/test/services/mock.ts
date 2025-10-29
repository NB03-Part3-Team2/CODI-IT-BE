import {
  CreateUserDto,
  CreatedUserDto,
  ResUserDto,
  UpdateUserDto,
} from '@modules/user/dto/userDTO';

// 공통 상수
export const MOCK_CONSTANTS = {
  USER_ID: 'user123',
  GRADE_ID: 'grade123',
  USER_NAME: '테스트유저',
  USER_EMAIL: 'test@example.com',
  ORIGINAL_PASSWORD: 'password123',
  HASHED_PASSWORD: 'hashedPassword123',
  MOCK_DATE: new Date('2024-01-01'),
  NEW_PASSWORD: 'newPassword123',
  IMAGE: 'http://example.com/image.jpg',
} as const;

// 미리 정의된 mock 데이터들
export const MOCK_DATA = {
  // 기본 사용자 생성 DTO
  createUserDto: {
    name: MOCK_CONSTANTS.USER_NAME,
    email: MOCK_CONSTANTS.USER_EMAIL,
    password: MOCK_CONSTANTS.ORIGINAL_PASSWORD,
    type: 'BUYER',
  } as CreateUserDto,

  // 기본 생성된 사용자
  createdUser: {
    id: MOCK_CONSTANTS.USER_ID,
    gradeId: MOCK_CONSTANTS.GRADE_ID,
    name: MOCK_CONSTANTS.USER_NAME,
    email: MOCK_CONSTANTS.USER_EMAIL,
    password: MOCK_CONSTANTS.HASHED_PASSWORD,
    type: 'BUYER',
    points: 0,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    totalAmount: 0,
    grade: {
      id: MOCK_CONSTANTS.GRADE_ID,
      name: 'Green',
      rate: 1,
      minAmount: 0,
      createdAt: MOCK_CONSTANTS.MOCK_DATE,
      updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    },
    image: null,
  } as CreatedUserDto,

  // 기본 응답용 사용자
  resUser: {
    id: MOCK_CONSTANTS.USER_ID,
    name: MOCK_CONSTANTS.USER_NAME,
    email: MOCK_CONSTANTS.USER_EMAIL,
    type: 'BUYER',
    points: 0,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    grade: {
      id: MOCK_CONSTANTS.GRADE_ID,
      name: 'Green',
      rate: 1,
      minAmount: 0,
    },
    image: null,
  } as ResUserDto,

  // 이메일 중복 검사용 기존 사용자
  existingUserByEmail: {
    id: 'existing123',
    gradeId: MOCK_CONSTANTS.GRADE_ID,
    name: '기존유저',
    email: MOCK_CONSTANTS.USER_EMAIL,
    password: MOCK_CONSTANTS.HASHED_PASSWORD,
    type: 'BUYER',
    points: 0,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    totalAmount: 0,
    grade: {
      id: MOCK_CONSTANTS.GRADE_ID,
      name: 'Green',
      rate: 1,
      minAmount: 0,
      createdAt: MOCK_CONSTANTS.MOCK_DATE,
      updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    },
    image: null,
  } as CreatedUserDto,

  // 이름 중복 검사용 기존 사용자
  existingUserByName: {
    id: 'existing123',
    gradeId: MOCK_CONSTANTS.GRADE_ID,
    name: MOCK_CONSTANTS.USER_NAME,
    email: 'existing@example.com',
    password: MOCK_CONSTANTS.HASHED_PASSWORD,
    type: 'BUYER',
    points: 0,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    totalAmount: 0,
    grade: {
      id: MOCK_CONSTANTS.GRADE_ID,
      name: 'Green',
      rate: 1,
      minAmount: 0,
      createdAt: MOCK_CONSTANTS.MOCK_DATE,
      updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    },
    image: null,
  } as CreatedUserDto,

  // getUser 테스트용 (points, totalAmount가 다른 값)
  getUser: {
    id: MOCK_CONSTANTS.USER_ID,
    gradeId: MOCK_CONSTANTS.GRADE_ID,
    name: MOCK_CONSTANTS.USER_NAME,
    email: MOCK_CONSTANTS.USER_EMAIL,
    password: MOCK_CONSTANTS.HASHED_PASSWORD,
    type: 'BUYER',
    points: 100,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    totalAmount: 5000,
    grade: {
      id: MOCK_CONSTANTS.GRADE_ID,
      name: 'Green',
      rate: 1,
      minAmount: 0,
      createdAt: MOCK_CONSTANTS.MOCK_DATE,
      updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    },
    image: null,
  } as CreatedUserDto,

  // getUser 응답용
  getUserResponse: {
    id: MOCK_CONSTANTS.USER_ID,
    name: MOCK_CONSTANTS.USER_NAME,
    email: MOCK_CONSTANTS.USER_EMAIL,
    type: 'BUYER',
    points: 100,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    grade: {
      id: MOCK_CONSTANTS.GRADE_ID,
      name: 'Green',
      rate: 1,
      minAmount: 0,
    },
    image: null,
  } as ResUserDto,

  // 업데이트용 DTO
  updateUserDto: {
    userId: MOCK_CONSTANTS.USER_ID,
    name: '업데이트된이름',
    password: MOCK_CONSTANTS.NEW_PASSWORD,
    currentPassword: MOCK_CONSTANTS.ORIGINAL_PASSWORD,
    image: MOCK_CONSTANTS.IMAGE,
  } as UpdateUserDto,

  updatedUser: {
    id: MOCK_CONSTANTS.USER_ID,
    gradeId: MOCK_CONSTANTS.GRADE_ID,
    name: '업데이트된이름',
    email: MOCK_CONSTANTS.USER_EMAIL,
    password: MOCK_CONSTANTS.HASHED_PASSWORD,
    type: 'BUYER',
    points: 100,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    totalAmount: 5000,
    grade: {
      id: MOCK_CONSTANTS.GRADE_ID,
      name: 'Green',
      rate: 1,
      minAmount: 0,
      createdAt: MOCK_CONSTANTS.MOCK_DATE,
      updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    },
    image: MOCK_CONSTANTS.IMAGE,
  },

  updatedUserResponse: {
    id: MOCK_CONSTANTS.USER_ID,
    name: '업데이트된이름',
    email: MOCK_CONSTANTS.USER_EMAIL,
    type: 'BUYER',
    points: 100,
    createdAt: MOCK_CONSTANTS.MOCK_DATE,
    updatedAt: MOCK_CONSTANTS.MOCK_DATE,
    grade: {
      id: MOCK_CONSTANTS.GRADE_ID,
      name: 'Green',
      rate: 1,
      minAmount: 0,
    },
    image: MOCK_CONSTANTS.IMAGE,
  } as ResUserDto,
} as const;
