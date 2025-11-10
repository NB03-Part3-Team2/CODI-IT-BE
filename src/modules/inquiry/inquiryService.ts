import inquiryRepository from '@modules/inquiry/inquiryRepo';
import productRepository from '@modules/product/productRepo';
import { ApiError } from '@errors/ApiError';
import { CreateInquiryDTO } from '@modules/inquiry/dto/inquiryDTO';

class InquiryService {
  createInquiry = async (userId: string, productId: string, createInquiryDto: CreateInquiryDTO) => {
    // path파라미터로 받은 상품이 있는지 먼저 조회
    const product = await productRepository.getById(productId);
    if (!product) {
      throw ApiError.notFound('상품을 찾을 수 없습니다.');
    }

    // inquiry 등록 레포지토리 호출
    const inquiry = await inquiryRepository.create(userId, productId, createInquiryDto);

    // 생성된 inquriy 반환
    return inquiry;
  };

  getInquiryList = async (productId: string) => {
    // path파라미터로 받은 상품이 있는지 먼저 조회
    const product = await productRepository.getById(productId);
    if (!product) {
      throw ApiError.notFound('상품을 찾을 수 없습니다.');
    }

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
}

export default new InquiryService();
