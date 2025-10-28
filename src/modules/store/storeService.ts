import storeRepository from '@modules/store/storeRepo';
import { ApiError } from '@errors/ApiError';
import { CreateStoreDto, UpdateStoreDto, GetMyProductListDto } from '@modules/store/dto/storeDTO';
import { UserType } from '@prisma/client';

class StoreService {
  createStore = async (userId: string, createStoreDto: CreateStoreDto) => {
    // 유저가 있는지 검사,swagger에는 없으나 에러 케이스 추가 - 404
    const user = await storeRepository.getUserTypeByUserId(userId);
    if (!user) {
      throw ApiError.notFound('존재하지 않는 유저입니다.');
    }
    // 유저 타입이 seller 인지 검사,swagger에는 없으나 에러 케이스 추가 - 400
    if (user.type !== UserType.SELLER) {
      throw ApiError.badRequest('스토어는 판매자만 만들수 있습니다.');
    }
    // 스토어가 이미 있는지 조회, swagger에는 없으나 에러 케이스 추가 - 409
    const store = await storeRepository.getStoreIdByUserId(userId);
    if (store) {
      throw ApiError.conflict('이미 스토어가 있습니다.');
    }
    return await storeRepository.create(userId, createStoreDto);
  };

  updateStore = async (userId: string, storeId: string, updateStoreDto: UpdateStoreDto) => {
    // 스토어가 존재하는지 검사, swagger에는 없으나 에러 케이스 추가
    const store = await storeRepository.getStoreIdByUserId(userId);
    if (!store) {
      throw ApiError.notFound('스토어가 존재하지 않습니다');
    }
    // 스토어가 유저의 스토어인지 검사
    if (store.id !== storeId) {
      throw ApiError.forbidden('올바른 접근이 아닙니다.');
    }
    // 스토어 업데이트
    return await storeRepository.update(storeId, updateStoreDto);
  };

  getStore = async (storeId: string) => {
    // 스토어가 존재하는지 검사, swagger에는 없으나 에러 케이스 추가
    const store = await storeRepository.getStoreById(storeId);
    if (!store) {
      throw ApiError.notFound('스토어가 존재하지 않습니다');
    }
    // 스토어 정보 반환
    return store;
  };

  getMyProductList = async (userId: string, pagenationDto: GetMyProductListDto) => {
    // 스토어가 존재하는지 검사, swagger에는 없으나 에러 케이스 추가
    const store = await storeRepository.getStoreIdByUserId(userId);
    if (!store) {
      throw ApiError.notFound('스토어가 존재하지 않습니다');
    }
    // 내 스토어 등록 상품들 정보 반환
    const productList = await storeRepository.getProductListByStoreId(store.id, pagenationDto);
    return productList;
  };
}

export default new StoreService();
