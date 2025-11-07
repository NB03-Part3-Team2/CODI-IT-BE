import { ApiError } from '@errors/ApiError';
import { CreateUserDto, UpdateUserDto } from '@modules/user/dto/userDTO';
import { prisma } from '@shared/prisma';

class UserRepository {
  createUser = async (createUserDto: CreateUserDto) => {
    const gradeGreenId = await prisma.grade.findFirst({
      where: { name: 'Green' },
    });
    if (!gradeGreenId) {
      throw ApiError.internal('기본 등급을 찾을 수 없습니다.');
    }
    const newUser: any = await prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: createUserDto.password,
        type: createUserDto.type,
        gradeId: gradeGreenId.id,
      },
      include: { grade: true },
    });
    return newUser;
  };

  getUserById = async (id: string) => {
    return await prisma.user.findUnique({
      where: { id },
      include: { grade: true },
    });
  };

  updateUser = async (updateUserDto: UpdateUserDto) => {
    const updatedUser = await prisma.user.update({
      where: { id: updateUserDto.userId },
      data: {
        name: updateUserDto.name,
        password: updateUserDto.newPassword,
        image: updateUserDto.image,
      },
      include: { grade: true },
    });
    return updatedUser;
  };

  deleteUser = async (userId: string) => {
    await prisma.user.delete({
      where: { id: userId },
    });
  };

  getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
      include: { grade: true },
    });
  };

  getUserByName = async (name: string) => {
    return await prisma.user.findUnique({
      where: { name },
    });
  };

  getFavoriteStoreList = async (userId: string) => {
    const favoriteStores = await prisma.storeLike.findMany({
      where: { userId },
      select: {
        storeId: true,
        userId: true,
        store: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            address: true,
            detailAddress: true,
            phoneNumber: true,
            content: true,
            image: true,
          },
        },
      },
    });
    return favoriteStores;
  };

  /**
   * OrderService에서 사용하는 메소드입니다.
   * 작성자: 박재성 (Order API 담당)
   * - getUserPoints: 사용자 포인트 조회
   */

  // 사용자 포인트 조회
  getUserPoints = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });
    return user?.points || 0;
  };
}

export default new UserRepository();
