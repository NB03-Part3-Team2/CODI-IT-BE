import { ApiError } from '@errors/ApiError';
import { UserCreateDto, UserCreatedDto } from '@modules/users/dto/userDTO';
import { prisma } from '@shared/prisma';

class userRepository {
  createUser = async (userDTO: UserCreateDto): Promise<UserCreatedDto> => {
    const gradeGreenId = await prisma.grade.findFirst({
      where: { name: 'Green' },
    });
    if (!gradeGreenId) {
      throw ApiError.internal('기본 등급을 찾을 수 없습니다.');
    }
    const newUser: any = await prisma.user.create({
      data: {
        email: userDTO.email,
        name: userDTO.name,
        password: userDTO.password,
        type: userDTO.type,
        gradeId: gradeGreenId.id,
      },
      include: { grade: true },
    });
    return newUser;
  };

  getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  };

  getUserByName = async (name: string) => {
    return await prisma.user.findUnique({
      where: { name },
    });
  };
}

export default new userRepository();
