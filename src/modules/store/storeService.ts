import storeRepository from '@store/storeRepo';
import { ApiError } from '@errors/ApiError';
import { CreateStoreDto, UpdateStoreDto } from '@store/dto/storeDTO';

class StoreService {
  createStore = async (userId: string, createStoreDto: CreateStoreDto) => {
    // 스토어가 이미 있는지 조회, swagger에는 없으나 에러 케이스 추가
    const store = await storeRepository.checkStoreByUserId(userId);
    if (store !== null) {
      throw ApiError.conflict('이미 스토어가 있습니다.');
    }
    return await storeRepository.create(userId, createStoreDto);
  };

  updateStore = async (userId: string, storeId: string, updateStoreDto: UpdateStoreDto) => {
    // 스토어가 존재하는지 검사, swagger에는 없으나 에러 케이스 추가
    const store = await storeRepository.checkStoreByUserId(userId);
    if (store === null) {
      throw ApiError.notFound('스토어가 존재하지 않습니다');
    }
    // 스토어가 유저의 스토어인지 검사
    if (store.id !== storeId) {
      throw ApiError.forbidden('올바른 접근이 아닙니다.');
    }
    // 스토어 업데이트
    return await storeRepository.update(storeId, updateStoreDto);
  };
}

export default new StoreService();
