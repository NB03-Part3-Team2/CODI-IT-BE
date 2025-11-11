import { Prisma } from '@prisma/client';
import { prisma } from '@shared/prisma';
import { ApiError } from '@errors/ApiError';
import {
  CreateOrderData,
  CreateOrderItemData,
  GetOrdersQueryDto,
} from '@modules/order/dto/orderDTO';

// 주문 상세 조회를 위한 select 옵션
const selectOrderWithDetailsDB = {
  id: true,
  userId: true,
  name: true,
  address: true,
  phoneNumber: true,
  subtotal: true,
  totalQuantity: true,
  usePoint: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      orderId: true,
      productId: true,
      sizeId: true,
      price: true,
      quantity: true,
      isReviewed: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      size: {
        select: {
          id: true,
          en: true,
          ko: true,
        },
      },
    },
  },
  payments: {
    select: {
      id: true,
      orderId: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    take: 1,
    orderBy: {
      createdAt: 'desc' as const,
    },
  },
};

class OrderRepository {
  /**
   * 트랜잭션 내에서 사용하는 헬퍼 메소드들입니다.
   * 주문 생성 트랜잭션을 관리하는 책임으로 인해 OrderRepository에 위치합니다.
   * - getStockForUpdate: 재고 조회 및 잠금 (트랜잭션 내에서 사용)
   * - decrementStock: 재고 차감 (트랜잭션 내에서 사용)
   * - decrementUserPoints: 사용자 포인트 차감 (트랜잭션 내에서 사용)
   */

  // 재고 조회 및 잠금 (트랜잭션 내에서 사용)
  getStockForUpdate = async (productId: string, sizeId: number, tx: Prisma.TransactionClient) => {
    return await tx.stock.findUnique({
      where: {
        productId_sizeId: {
          productId,
          sizeId,
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });
  };

  // 재고 차감 (트랜잭션 내에서 사용)
  decrementStock = async (
    productId: string,
    sizeId: number,
    quantity: number,
    tx: Prisma.TransactionClient,
  ) => {
    return await tx.stock.update({
      where: {
        productId_sizeId: {
          productId,
          sizeId,
        },
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  };

  // 사용자 포인트 차감 (트랜잭션 내에서 사용)
  decrementUserPoints = async (userId: string, points: number, tx: Prisma.TransactionClient) => {
    return await tx.user.update({
      where: { id: userId },
      data: {
        points: {
          decrement: points,
        },
      },
    });
  };

  // 주문 생성 (트랜잭션 처리)
  createOrder = async (
    orderData: CreateOrderData,
    orderItems: CreateOrderItemData[],
    paymentPrice: number,
  ) => {
    return await prisma.$transaction(
      async (tx) => {
        // 1. 재고 검증 (트랜잭션 내에서 검증)
        for (const item of orderItems) {
          const stock = await this.getStockForUpdate(item.productId, item.sizeId, tx);

          // 재고가 존재하지 않는 경우
          if (!stock) {
            throw ApiError.notFound(
              `상품 ID ${item.productId}, 사이즈 ID ${item.sizeId}에 대한 재고를 찾을 수 없습니다.`,
            );
          }

          // 재고가 부족한 경우
          if (stock.quantity < item.quantity) {
            throw ApiError.badRequest(
              `상품 ID ${item.productId}, 사이즈 ID ${item.sizeId}의 재고가 부족합니다. (요청: ${item.quantity}, 재고: ${stock.quantity})`,
            );
          }
        }

        // 2. 주문 생성
        const order = await tx.order.create({
          data: orderData,
        });

        // 3. 주문 아이템 생성
        const orderItemsData = orderItems.map((item) => ({
          orderId: order.id,
          ...item,
        }));

        await tx.orderItem.createMany({
          data: orderItemsData,
        });

        // 4. 결제 정보 생성
        await tx.payment.create({
          data: {
            orderId: order.id,
            price: paymentPrice,
            status: 'COMPLETED',
          },
        });

        // 5. 재고 차감
        for (const item of orderItems) {
          await this.decrementStock(item.productId, item.sizeId, item.quantity, tx);
        }

        // 6. 포인트 차감 (usePoint가 0보다 큰 경우)
        if (orderData.usePoint > 0) {
          await this.decrementUserPoints(orderData.userId, orderData.usePoint, tx);
        }

        // 7. 생성된 주문 상세 정보 조회 및 반환
        const createdOrder = await tx.order.findUnique({
          where: { id: order.id },
          select: selectOrderWithDetailsDB,
        });

        return createdOrder;
      },
      {
        timeout: 10000, // 10초 타임아웃
      },
    );
  };

  // 주문 목록 조회 (페이지네이션 포함)
  getOrders = async (userId: string, query: GetOrdersQueryDto) => {
    const { status, limit, page } = query;

    // where 조건 구성
    const where: Prisma.OrderWhereInput = {
      userId,
      ...(status && {
        payments: {
          some: {
            status,
          },
        },
      }),
    };

    // 전체 개수 조회
    const total = await prisma.order.count({ where });

    // 주문 목록 조회
    const orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        address: true,
        subtotal: true,
        totalQuantity: true,
        usePoint: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            price: true,
            quantity: true,
            productId: true,
            isReviewed: true,
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
            size: {
              select: {
                id: true,
                en: true,
                ko: true,
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            price: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            orderId: true,
          },
          take: 1,
          orderBy: {
            createdAt: 'desc' as const,
          },
        },
      },
      orderBy: {
        createdAt: 'desc' as const,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      orders,
      total,
      page,
      limit,
    };
  };
}

export default new OrderRepository();
