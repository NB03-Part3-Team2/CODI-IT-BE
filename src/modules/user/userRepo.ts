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
        password: updateUserDto.password,
        image: updateUserDto.image,
      },
      include: { grade: true },
    });
    return updatedUser;
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
}

export default new UserRepository();
