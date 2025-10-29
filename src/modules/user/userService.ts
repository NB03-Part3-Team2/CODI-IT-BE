import userRepository from '@modules/user/userRepo';
import {
  CreateUserDto,
  UpdateUserDto,
  CreatedUserDto,
  ResUserDto,
} from '@modules/user/dto/userDTO';
import { ApiError } from '@errors/ApiError';
import { hashPassword, isPasswordValid } from '@modules/auth/utils/passwordUtils';

class UserService {
  sensitiveUserDataFilter = (user: CreatedUserDto): ResUserDto => {
    const { totalAmount, gradeId, grade, password, image, ...rest } = user;
    const { createdAt, updatedAt, ...gradeInfo } = grade;
    const filteredUser = {
      ...rest,
      grade: gradeInfo,
      image,
    };
    return filteredUser;
  };

  createUser = async (createUserDto: CreateUserDto): Promise<ResUserDto> => {
    const existingUser = await userRepository.getUserByEmail(createUserDto.email);
    if (existingUser) {
      throw ApiError.conflict('이미 존재하는 이메일입니다.');
    }
    const existingName = await userRepository.getUserByName(createUserDto.name);
    if (existingName) {
      throw ApiError.conflict('이미 존재하는 이름입니다.');
    }
    createUserDto.password = await hashPassword(createUserDto.password);
    const createdUser = await userRepository.createUser(createUserDto);
    if (!createdUser) {
      throw ApiError.internal('사용자 생성에 실패했습니다.');
    }
    return this.sensitiveUserDataFilter(createdUser);
  };

  getUser = async (userId: string): Promise<ResUserDto> => {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw ApiError.notFound('존재하지 않는 사용자입니다.');
    }
    return this.sensitiveUserDataFilter(user);
  };

  updateUser = async (updateUserDto: UpdateUserDto): Promise<ResUserDto> => {
    if (updateUserDto.password === updateUserDto.currentPassword) {
      throw ApiError.badRequest('새 비밀번호는 현재 비밀번호와 다르게 설정해야 합니다.');
    }
    const user = await userRepository.getUserById(updateUserDto.userId);
    if (!user) {
      throw ApiError.notFound('존재하지 않는 사용자입니다.');
    }
    const isValid = await isPasswordValid(updateUserDto.currentPassword, user.password);
    if (!isValid) {
      throw ApiError.unauthorized('현재 비밀번호가 올바르지 않습니다.');
    }
    updateUserDto.password = await hashPassword(updateUserDto.password);
    const updatedUser = await userRepository.updateUser(updateUserDto);
    if (!updatedUser) {
      throw ApiError.internal('사용자 업데이트에 실패했습니다.');
    }
    return this.sensitiveUserDataFilter(updatedUser);
  };

  getUserByEmail = async (email: string): Promise<CreatedUserDto | null> => {
    const user = await userRepository.getUserByEmail(email);
    return user;
  };
}

export default new UserService();
