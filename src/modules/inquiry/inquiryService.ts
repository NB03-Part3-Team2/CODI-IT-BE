import inquiryRepository from '@modules/inquiry/inquiryRepo';
import productRepository from '@modules/product/productRepo';
import storeRepository from '@modules/store/storeRepo';
import { ApiError } from '@errors/ApiError';
import { assert } from '@utils/assert';
import {
  fromPrismaInquiryStatus,
  toPrismaInquiryStatus,
} from '@modules/inquiry/utils/inquiryUtils';
import {
  CreateInquiryDTO,
  GetInquiryResponseDTO,
  GetMyInquiryItemDTO,
  GetMyInquiryListDTO,
  GetMyInquiryListRepoDTO,
  GetMyInquiryListResponseDTO,
} from '@modules/inquiry/dto/inquiryDTO';

import userRepository from '@modules/user/userRepo';
import { UserType } from '@prisma/client';

class InquiryService {
  createInquiry = async (userId: string, productId: string, createInquiryDto: CreateInquiryDTO) => {
    // path파라미터로 받은 상품이 있는지 먼저 조회
    const product = await productRepository.getById(productId);
    assert(product, ApiError.notFound('상품을 찾을 수 없습니다.'));

    // inquiry 등록 레포지토리 호출
    const inquiry = await inquiryRepository.create(userId, productId, createInquiryDto);

    // 생성된 inquriy 반환
    return inquiry;
  };

  getInquiryList = async (productId: string) => {
    // path파라미터로 받은 상품이 있는지 먼저 조회
    const product = await productRepository.getById(productId);
    assert(product, ApiError.notFound('상품을 찾을 수 없습니다.'));

    // 문의 리스트 조회
    const inquiries = await inquiryRepository.getInquiryListByProductId(productId);
    // 문의 개수 조회
    const totalCount = await inquiryRepository.getInquiryCountByProductId(productId);

    // 리스폰스 형태에 맞게 가공 후 반환
    return {
      list: inquiries,
      totalCount,
    };
  };

  getMyInquiryList = async (
    userId: string,
    getMyInquiryListDTO: GetMyInquiryListDTO,
  ): Promise<GetMyInquiryListResponseDTO> => {
    const { status: statusString, ...restOfDto } = getMyInquiryListDTO;

    // repository 레이어에 넣기 위해 prisma 타입으로 변경
    const getMyInquiryListRepoDTO: GetMyInquiryListRepoDTO = {
      ...restOfDto,
      status: statusString ? toPrismaInquiryStatus(statusString) : undefined,
    };

    // 구매자인지 판매자인지 알기 위해 유저 정보 조회
    const user = await userRepository.getUserById(userId);
    assert(user, ApiError.notFound('유저를 찾을 수 없습니다.'));

    // 페이지네이션 된 문의 리스트 및 문의 개수 조회
    let list;
    let totalCount;
    if (user.type === UserType.BUYER) {
      // 구매자인 경우 자신이 등록한 문의 조회
      [list, totalCount] = await Promise.all([
        inquiryRepository.getInquiriesByUserId(userId, getMyInquiryListRepoDTO),
        inquiryRepository.getTotalCountByUserId(userId, getMyInquiryListRepoDTO.status),
      ]);
    } else {
      // 판매자인 경우 스토어의 id와 일치하는 product들의 문의 조회
      const store = await storeRepository.getStoreIdByUserId(userId);
      assert(store, ApiError.notFound('스토어를 찾을 수 없습니다.'));
      [list, totalCount] = await Promise.all([
        inquiryRepository.getInquiriesByStoreId(store.id, getMyInquiryListRepoDTO),
        inquiryRepository.getTotalCountByStoreId(store.id, getMyInquiryListRepoDTO.status),
      ]);
    }

    // 리스폰스 형태에 맞게 가공 + status 문자열 형태 변경
    const formattedList: GetMyInquiryItemDTO[] = list.map((inquiry) => ({
      ...inquiry,
      status: fromPrismaInquiryStatus(inquiry.status),
    }));

    return { list: formattedList, totalCount };
  };

  getInquiry = async (inquiryId: string): Promise<GetInquiryResponseDTO> => {
    // 문의 상세 조회
    const inquiry = await inquiryRepository.getById(inquiryId);
    assert(inquiry, ApiError.notFound('문의가 존재하지 않습니다.'));

    // 리스폰스 형태에 맞게 가공
    return {
      ...inquiry,
      status: fromPrismaInquiryStatus(inquiry.status),
    };
  };
}

export default new InquiryService();
