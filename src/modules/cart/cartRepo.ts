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
  getByUserId = async (userId: string) => {
    return await prisma.cart.findUnique({
      where: { userId },
      select: selectOptionDB,
    });
  };

  // 사용자 ID로 장바구니 상세 조회
  getCartWithDetails = async (userId: string) => {
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

  // 상품 존재 여부 확인
  checkProductExists = async (productId: string) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    return product !== null;
  };

  // 재고 확인
  getStock = async (productId: string, sizeId: number) => {
    return await prisma.stock.findUnique({
      where: {
        productId_sizeId: {
          productId,
          sizeId,
        },
      },
      select: {
        quantity: true,
      },
    });
  };

  // CartItem upsert (존재하면 업데이트, 없으면 생성)
  upsertCartItem = async (cartId: string, productId: string, sizeId: number, quantity: number) => {
    return await prisma.cartItem.upsert({
      where: {
        cartId_productId_sizeId: {
          cartId,
          productId,
          sizeId,
        },
      },
      update: {
        quantity,
        updatedAt: new Date(),
      },
      create: {
        cartId,
        productId,
        sizeId,
        quantity,
      },
      select: {
        id: true,
        cartId: true,
        productId: true,
        sizeId: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };

  // 특정 상품의 CartItem들 조회
  getCartItemsByProductId = async (cartId: string, productId: string) => {
    return await prisma.cartItem.findMany({
      where: {
        cartId,
        productId,
      },
      select: {
        id: true,
        cartId: true,
        productId: true,
        sizeId: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };
}

export default new CartRepository();
