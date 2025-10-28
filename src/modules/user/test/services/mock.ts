import { CreateUserDto, CreatedUserDto, ResUserDto } from '@modules/user/dto/userDTO';

// 공통 상수
export const MOCK_CONSTANTS = {
  USER_ID: 'user123',
  GRADE_ID: 'grade123',
  USER_NAME: '테스트유저',
  USER_EMAIL: 'test@example.com',
  ORIGINAL_PASSWORD: 'password123',
  HASHED_PASSWORD: 'hashedPassword123',
  MOCK_DATE: new Date('2024-01-01'),
} as const;

// 기본 grade 객체 (createdAt, updatedAt 포함)
export const mockGradeWithDates = {
  id: MOCK_CONSTANTS.GRADE_ID,
  name: 'Green',
  rate: 0.01,
  minAmount: 0,
  createdAt: MOCK_CONSTANTS.MOCK_DATE,
  updatedAt: MOCK_CONSTANTS.MOCK_DATE,
};

// Response용 grade 객체 (createdAt, updatedAt 제외)
export const mockGradeForResponse = {
  id: MOCK_CONSTANTS.GRADE_ID,
  name: 'Green',
  rate: 0.01,
  minAmount: 0,
};

// CreateUserDto 생성 함수
export const createMockCreateUserDto = (overrides?: Partial<CreateUserDto>): CreateUserDto => ({
  name: MOCK_CONSTANTS.USER_NAME,
  email: MOCK_CONSTANTS.USER_EMAIL,
  password: MOCK_CONSTANTS.ORIGINAL_PASSWORD,
  type: 'BUYER',
  ...overrides,
});

// CreatedUserDto 생성 함수
export const createMockCreatedUser = (overrides?: Partial<CreatedUserDto>): CreatedUserDto => ({
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
  grade: mockGradeWithDates,
  image: null,
  ...overrides,
});

// ResUserDto 생성 함수
export const createMockResUser = (overrides?: Partial<ResUserDto>): ResUserDto => ({
  id: MOCK_CONSTANTS.USER_ID,
  name: MOCK_CONSTANTS.USER_NAME,
  email: MOCK_CONSTANTS.USER_EMAIL,
  type: 'BUYER',
  points: 0,
  createdAt: MOCK_CONSTANTS.MOCK_DATE,
  updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  grade: mockGradeForResponse,
  image: null,
  ...overrides,
});

// 기존 사용자 데이터 생성 함수 (중복 검사용)
export const createExistingUserMock = (overrides?: Partial<CreatedUserDto>): CreatedUserDto => ({
  id: 'existing123',
  gradeId: MOCK_CONSTANTS.GRADE_ID,
  name: '기존유저',
  email: 'existing@example.com',
  password: MOCK_CONSTANTS.HASHED_PASSWORD,
  type: 'BUYER',
  points: 0,
  createdAt: MOCK_CONSTANTS.MOCK_DATE,
  updatedAt: MOCK_CONSTANTS.MOCK_DATE,
  totalAmount: 0,
  grade: mockGradeWithDates,
  image: null,
  ...overrides,
});

// 미리 정의된 mock 데이터들
export const MOCK_DATA = {
  // 기본 사용자 생성 DTO
  createUserDto: createMockCreateUserDto(),

  // 기본 생성된 사용자
  createdUser: createMockCreatedUser(),

  // 기본 응답용 사용자
  resUser: createMockResUser(),

  // 이메일 중복 검사용 기존 사용자
  existingUserByEmail: createExistingUserMock({
    email: MOCK_CONSTANTS.USER_EMAIL,
    name: '기존유저',
  }),

  // 이름 중복 검사용 기존 사용자
  existingUserByName: createExistingUserMock({
    name: MOCK_CONSTANTS.USER_NAME,
    email: 'existing@example.com',
  }),

  // getUser 테스트용 (points, totalAmount가 다른 값)
  getUserMock: createMockCreatedUser({
    points: 100,
    totalAmount: 5000,
  }),

  // getUser 응답용
  getUserResponse: createMockResUser({
    points: 100,
  }),
} as const;
