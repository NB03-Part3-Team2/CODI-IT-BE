import usersRepository from '@modules/users/usersRepo';
import { CreateUserDto } from '@modules/users/dto/userDTO';
import { ApiError } from '@errors/ApiError';
import { hashPassword } from '@modules/auth/utils/passwordUtils';

class UsersService {
  sensitiveUserDataFilter = (user: any) => {
    const { password, ...filteredUser } = user;
    return filteredUser;
  };

  createUser = async (createUserDto: CreateUserDto) => {
    const existingUser = await usersRepository.getUserByEmail(createUserDto.email);
    if (existingUser) {
      throw ApiError.conflict('이미 존재하는 이메일입니다.');
    }
    const existingName = await usersRepository.getUserByName(createUserDto.name);
    if (existingName) {
      throw ApiError.conflict('이미 존재하는 이름입니다.');
    }
    createUserDto.password = await hashPassword(createUserDto.password);
    const createdUser = await usersRepository.createUser(createUserDto);
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
    const user = await usersRepository.getUserByEmail(email);
    return user;
  };
}

export default new UsersService();
