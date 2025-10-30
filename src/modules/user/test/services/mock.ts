import { CreateUserDto } from '@modules/user/dto/userDTO';

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

// 기본 객체들
const baseGrade = {
  id: MOCK_CONSTANTS.GRADE_ID,
  name: 'Green',
  rate: 1,
  minAmount: 0,
} as const;

const baseGradeWithDates = {
  ...baseGrade,
  createdAt: MOCK_CONSTANTS.MOCK_DATE,
  updatedAt: MOCK_CONSTANTS.MOCK_DATE,
} as const;

const baseUser = {
  type: 'BUYER',
  createdAt: MOCK_CONSTANTS.MOCK_DATE,
  updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  image: null,
} as const;

const baseCreatedUser = {
  ...baseUser,
  id: MOCK_CONSTANTS.USER_ID,
  gradeId: MOCK_CONSTANTS.GRADE_ID,
  name: MOCK_CONSTANTS.USER_NAME,
  email: MOCK_CONSTANTS.USER_EMAIL,
  password: MOCK_CONSTANTS.HASHED_PASSWORD,
  points: 0,
  totalAmount: 0,
  grade: baseGradeWithDates,
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
  createdUser: baseCreatedUser,

  // 기본 응답용 사용자
  resUser: {
    ...baseUser,
    id: MOCK_CONSTANTS.USER_ID,
    name: MOCK_CONSTANTS.USER_NAME,
    email: MOCK_CONSTANTS.USER_EMAIL,
    points: 0,
    grade: baseGrade,
  },

  // 이메일 중복 검사용 기존 사용자
  existingUserByEmail: {
    ...baseCreatedUser,
    id: 'existing123',
    name: '기존유저',
  },

  // 이름 중복 검사용 기존 사용자
  existingUserByName: {
    ...baseCreatedUser,
    id: 'existing123',
    email: 'existing@example.com',
  },

  // getUser 테스트용 (points, totalAmount가 다른 값)
  getUser: {
    ...baseCreatedUser,
    points: 100,
    totalAmount: 5000,
  },

  // getUser 응답용
  getUserResponse: {
    ...baseUser,
    id: MOCK_CONSTANTS.USER_ID,
    name: MOCK_CONSTANTS.USER_NAME,
    email: MOCK_CONSTANTS.USER_EMAIL,
    points: 100,
    grade: baseGrade,
  },

  // 업데이트용 DTO
  updateUserDto: {
    userId: MOCK_CONSTANTS.USER_ID,
    name: '업데이트된이름',
    password: MOCK_CONSTANTS.NEW_PASSWORD,
    currentPassword: MOCK_CONSTANTS.ORIGINAL_PASSWORD,
    image: MOCK_CONSTANTS.IMAGE,
  },

  // 업데이트된 사용자
  updatedUser: {
    ...baseCreatedUser,
    name: '업데이트된이름',
    points: 100,
    totalAmount: 5000,
    image: MOCK_CONSTANTS.IMAGE,
  },

  // 업데이트된 사용자 응답
  updatedUserResponse: {
    ...baseUser,
    id: MOCK_CONSTANTS.USER_ID,
    name: '업데이트된이름',
    email: MOCK_CONSTANTS.USER_EMAIL,
    points: 100,
    grade: baseGrade,
    image: MOCK_CONSTANTS.IMAGE,
  },
} as const;
