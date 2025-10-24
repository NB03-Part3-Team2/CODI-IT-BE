import { prisma } from '@shared/prisma';
import { CreateStoreDTO, UpdateStoreDTO } from '@store/dto/storeDTO';

class StoreRepository {
  create = async (userId: string, createStoreDTO: CreateStoreDTO) => {
    return await prisma.store.create({
      data: { userId, ...createStoreDTO },
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
    });
  };

  update = async (storeId: string, updateStoreDTO: UpdateStoreDTO) => {
    return await prisma.store.update({
      where: {
        id: storeId,
      },
      data: updateStoreDTO,
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
