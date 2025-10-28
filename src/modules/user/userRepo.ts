import { ApiError } from '@errors/ApiError';
import { CreateUserDto, CreatedUserDto } from '@modules/user/dto/userDTO';
import { prisma } from '@shared/prisma';

class UserRepository {
  createUser = async (createUserDto: CreateUserDto): Promise<CreatedUserDto> => {
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
