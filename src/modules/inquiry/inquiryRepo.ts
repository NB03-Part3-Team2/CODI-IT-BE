import { prisma } from '@shared/prisma';
import { CreateInquiryDTO } from '@modules/inquiry/dto/inquiryDTO';

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
}

export default new InquiryRepository();
