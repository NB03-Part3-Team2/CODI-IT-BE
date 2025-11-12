import { prisma } from '@shared/prisma';
import { CreateInquiryDTO, GetMyInquiryListRepoDTO } from '@modules/inquiry/dto/inquiryDTO';
import { InquiryStatus } from '@prisma/client';

const myInquiryListQuerySelect = {
  id: true,
  title: true,
  isSecret: true,
  status: true,
  createdAt: true,
  content: true,
  product: {
    select: {
      id: true,
      name: true,
      image: true,
      store: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

class InquiryRepository {
  create = async (userId: string, productId: string, createInquiryDto: CreateInquiryDTO) => {
    return await prisma.inquiry.create({
      data: {
        ...createInquiryDto,
        userId,
        productId,
      },
    });
  };

  getInquiryListByProductId = async (productId: string) => {
    return await prisma.inquiry.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        reply: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  };

  getInquiryCountByProductId = async (productId: string) => {
    return await prisma.inquiry.count({
      where: {
        productId,
      },
    });
  };

  // 페이지네이션으로 일부 정보만 받아온 문의 리스트 (구매자)
  getInquiriesByUserId = async (
    userId: string,
    { page, pageSize, status }: GetMyInquiryListRepoDTO,
  ) => {
    return await prisma.inquiry.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      select: myInquiryListQuerySelect,
      ...this._paginateQuery(page, pageSize),
    });
  };

  // 문의 개수 조회 (구매자)
  getTotalCountByUserId = async (userId: string, status?: InquiryStatus) => {
    return await prisma.inquiry.count({
      where: {
        userId,
        ...(status && { status }),
      },
    });
  };

  // 페이지네이션으로 일부 정보만 받아온 문의 리스트 (판매자)
  getInquiriesByStoreId = async (
    storeId: string,
    { page, pageSize, status }: GetMyInquiryListRepoDTO,
  ) => {
    return await prisma.inquiry.findMany({
      where: {
        product: {
          storeId,
        },
        ...(status && { status }),
      },
      select: myInquiryListQuerySelect,
      ...this._paginateQuery(page, pageSize),
    });
  };

  // 문의 개수 조회 (판매자)
  getTotalCountByStoreId = async (storeId: string, status?: InquiryStatus) => {
    return await prisma.inquiry.count({
      where: {
        product: {
          storeId,
        },
        ...(status && { status }),
      },
    });
  };
  // 공통 페이징 함수
  private _paginateQuery = (
    page: number,
    pageSize: number,
    orderBy: any = { createdAt: 'desc' },
  ) => ({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy,
  });
}

export default new InquiryRepository();
