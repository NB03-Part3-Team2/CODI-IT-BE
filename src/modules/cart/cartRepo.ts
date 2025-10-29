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

// 장바구니 상세 조회를 위한 select 옵션
const selectCartWithDetailsDB = {
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      cartId: true,
      productId: true,
      sizeId: true,
      quantity: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          storeId: true,
          name: true,
          price: true,
          image: true,
          discountRate: true,
          discountStartTime: true,
          discountEndTime: true,
          createdAt: true,
          updatedAt: true,
          store: {
            select: {
              id: true,
              userId: true,
              name: true,
              address: true,
              phoneNumber: true,
              content: true,
              image: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          stocks: {
            select: {
              id: true,
              productId: true,
              sizeId: true,
              quantity: true,
              size: {
                select: {
                  id: true,
                  en: true,
                  ko: true,
                },
              },
            },
          },
        },
      },
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

  // 사용자 ID로 장바구니 상세 조회
  findCartWithDetails = async (userId: string) => {
    return await prisma.cart.findUnique({
      where: { userId },
      select: selectCartWithDetailsDB,
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
