import { prisma } from '@shared/prisma';

// create와 findByUserId에서 사용할 select 옵션
const selectOptionDB = {
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      quantity: true,
    },
  },
};

class CartRepository {
  // 사용자 ID로 장바구니 조회
  findByUserId = async (userId: string) => {
    return await prisma.cart.findUnique({
      where: { userId },
      select: selectOptionDB,
    });
  };

  // 장바구니 생성
  create = async (userId: string) => {
    return await prisma.cart.create({
      data: { userId },
      select: selectOptionDB,
    });
  };
}

export default new CartRepository();
