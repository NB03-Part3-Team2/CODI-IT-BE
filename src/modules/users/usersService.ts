import userRepository from '@modules/users/usersRepo';
import { UserCreateDto } from '@modules/users/dto/userDTO';
import { ApiError } from '@errors/ApiError';
import { hashPassword } from '@modules/auth/utils/passwordUtils';

class UserService {
  sensitiveUserDataFilter = (user: any) => {
    const { password, ...filteredUser } = user;
    return filteredUser;
  };

  createUser = async (UserCreateDto: UserCreateDto) => {
    const existingUser = await userRepository.getUserByEmail(UserCreateDto.email);
    if (existingUser) {
      throw ApiError.conflict('이미 존재하는 이메일입니다.');
    }
    const existingName = await userRepository.getUserByName(UserCreateDto.name);
    if (existingName) {
      throw ApiError.conflict('이미 존재하는 이름입니다.');
    }
    UserCreateDto.password = await hashPassword(UserCreateDto.password);
    const createdUser = await userRepository.createUser(UserCreateDto);
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
}

export default new UserService();
