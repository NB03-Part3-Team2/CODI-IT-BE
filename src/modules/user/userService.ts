import userRepository from '@modules/user/userRepo';
import { CreateUserDto } from '@modules/user/dto/userDTO';
import { ApiError } from '@errors/ApiError';
import { hashPassword } from '@modules/auth/utils/passwordUtils';

class UserService {
  sensitiveUserDataFilter = (user: any) => {
    const { password, ...filteredUser } = user;
    return filteredUser;
  };

  createUser = async (createUserDto: CreateUserDto) => {
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
    const { totalAmount, gradeId, grade, password, image, ...filteredUser } = createdUser;
    const { createdAt, updatedAt, ...gradeInfo } = grade;
    const user = {
      ...filteredUser,
      grade: gradeInfo,
      image,
    };
    return user;
  };

  getUserByEmail = async (email: string) => {
    const user = await userRepository.getUserByEmail(email);
    return user;
  };
}

export default new UserService();
