import userRepository from '@modules/user/userRepo';
import { ApiError } from '@errors/ApiError';
import { assert } from '@utils/assert';
import { hashPassword, isPasswordValid } from '@modules/auth/utils/passwordUtils';
import {
  CreateUserDto,
  UpdateUserDto,
  CreatedUserDto,
  ResUserDto,
} from '@modules/user/dto/userDTO';
import { ResFavoriteStoreDto } from '@modules/user/dto/favoriteStoreDTO';
import { deleteImageFromS3 } from '@utils/s3DeleteUtils';

class UserService {
  sensitiveUserDataFilter = (user: CreatedUserDto): ResUserDto => {
    const { totalAmount, password, ...rest } = user;
    const { createdAt, updatedAt, ...gradeInfo } = rest.grade;
    const filteredUser = {
      ...rest,
      grade: gradeInfo,
    };
    return filteredUser;
  };

  createUser = async (createUserDto: CreateUserDto): Promise<ResUserDto> => {
    const existingUser = await userRepository.getUserByEmail(createUserDto.email);
    assert(!existingUser, ApiError.conflict('이미 존재하는 이메일입니다.'));

    const existingName = await userRepository.getUserByName(createUserDto.name);
    assert(!existingName, ApiError.conflict('이미 존재하는 이름입니다.'));

    createUserDto.password = await hashPassword(createUserDto.password);
    const createdUser = await userRepository.createUser(createUserDto);
    return this.sensitiveUserDataFilter(createdUser);
  };

  getUser = async (userId: string): Promise<ResUserDto> => {
    const user = await userRepository.getUserById(userId);
    assert(user, ApiError.notFound('존재하지 않는 사용자입니다.'));

    return this.sensitiveUserDataFilter(user);
  };

  updateUser = async (updateUserDto: UpdateUserDto): Promise<ResUserDto> => {
    assert(
      updateUserDto.newPassword !== updateUserDto.currentPassword,
      ApiError.badRequest('새 비밀번호는 현재 비밀번호와 다르게 설정해야 합니다.'),
    );

    const user = await userRepository.getUserById(updateUserDto.userId);
    assert(user, ApiError.notFound('존재하지 않는 사용자입니다.'));

    const isValid = await isPasswordValid(updateUserDto.currentPassword, user.password);
    assert(isValid, ApiError.badRequest('현재 비밀번호가 올바르지 않습니다.'));

    const existingName = await userRepository.getUserByName(updateUserDto.name);
    assert(
      !existingName || existingName.id === updateUserDto.userId,
      ApiError.conflict('이미 존재하는 이름입니다.'),
    );

    updateUserDto.newPassword = await hashPassword(updateUserDto.newPassword);

    const updatedUser = await userRepository.updateUser(updateUserDto);
    if (user.image && updateUserDto.image && updateUserDto.image !== user.image) {
      await deleteImageFromS3(user.image);
    }
    return this.sensitiveUserDataFilter(updatedUser);
  };

  deleteUser = async (userId: string): Promise<void> => {
    const user = await userRepository.getUserById(userId);
    assert(user, ApiError.notFound('존재하지 않는 사용자입니다.'));

    await userRepository.deleteUser(userId);
  };

  getFavoriteStoreList = async (userId: string): Promise<ResFavoriteStoreDto[]> => {
    const favoriteStoreList = await userRepository.getFavoriteStoreList(userId);
    return favoriteStoreList;
  };

  getUserByEmail = async (email: string): Promise<CreatedUserDto | null> => {
    const user = await userRepository.getUserByEmail(email);
    return user;
  };
}

export default new UserService();
