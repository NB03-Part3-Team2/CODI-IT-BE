import { prisma } from '@shared/prisma';
import { CreateStoreDto, UpdateStoreDto } from '@modules/store/dto/storeDTO';

// create와 update에서 사용할 select 옵션
const selectOptionDB = {
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
};

class StoreRepository {
  create = async (userId: string, createStoreDto: CreateStoreDto) => {
    return await prisma.store.create({
      data: { userId, ...createStoreDto },
      select: selectOptionDB,
    });
  };

  update = async (storeId: string, updateStoreDto: UpdateStoreDto) => {
    return await prisma.store.update({
      where: {
        id: storeId,
      },
      data: updateStoreDto,
      select: selectOptionDB,
    });
  };

  checkStoreByUserId = async (userId: string) => {
    // 스토어 존재 여부만 확인하기 위한 최소데이터 조회
    const store = await prisma.store.findUnique({
      where: { userId },
      select: {
        id: true,
      },
    });
    return store;
  };
}

export default new StoreRepository();
