import { prisma } from '@shared/prisma';

class DashboardRepository {
  /**
   * 기간별 주문 통계 조회
   * 판매자(sellerId)의 스토어 상품에 대한 주문 수와 매출액을 조회합니다.
   * @param sellerId - 판매자(사용자) ID
   * @param startDate - 시작 날짜
   * @param endDate - 종료 날짜
   */
  getOrderStatsByPeriod = async (sellerId: string, startDate: Date, endDate: Date) => {
    // 1. 판매자의 스토어 ID 조회
    const store = await prisma.store.findUnique({
      where: { userId: sellerId },
      select: { id: true },
    });

    if (!store) {
      return { totalOrders: 0, totalSales: 0 };
    }

    // 2. 해당 기간 동안 완료된 결제가 있는 주문들을 집계
    const result = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        items: {
          some: {
            product: {
              storeId: store.id,
            },
          },
        },
        payments: {
          some: {
            status: 'CompletedPayment',
          },
        },
      },
      select: {
        id: true,
        items: {
          where: {
            product: {
              storeId: store.id,
            },
          },
          select: {
            price: true,
            quantity: true,
          },
        },
      },
    });

    // 3. 주문 수와 매출액 계산
    const totalOrders = result.length;
    const totalSales = result.reduce((sum, order) => {
      const orderSales = order.items.reduce(
        (itemSum, item) => itemSum + item.price * item.quantity,
        0,
      );
      return sum + orderSales;
    }, 0);

    return { totalOrders, totalSales };
  };

  /**
   * 최다 판매 상품 조회
   * 전체 기간 동안 가장 많이 팔린 상품을 조회합니다.
   * @param sellerId - 판매자(사용자) ID
   * @param limit - 조회할 상품 수
   */
  getTopSellingProducts = async (sellerId: string, limit: number = 5) => {
    // 1. 판매자의 스토어 ID 조회
    const store = await prisma.store.findUnique({
      where: { userId: sellerId },
      select: { id: true },
    });

    if (!store) {
      return [];
    }

    // 2. 완료된 결제가 있는 주문의 상품별 판매량 집계
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        product: {
          storeId: store.id,
        },
        order: {
          payments: {
            some: {
              status: 'CompletedPayment',
            },
          },
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    // 3. 상품 정보 조회
    const productIds = topProducts.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

    // 4. 결과 매핑
    const productMap = new Map(products.map((p) => [p.id, p]));
    return topProducts
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;
        return {
          totalOrders: item._sum.quantity || 0,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
          },
        };
      })
      .filter((item) => item !== null);
  };

  /**
   * 전체 완료된 주문 조회 (가격 범위별 매출 계산용)
   * @param sellerId - 판매자(사용자) ID
   */
  getAllCompletedOrders = async (sellerId: string) => {
    // 1. 판매자의 스토어 ID 조회
    const store = await prisma.store.findUnique({
      where: { userId: sellerId },
      select: { id: true },
    });

    if (!store) {
      return [];
    }

    // 2. 완료된 결제가 있는 모든 주문 조회
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              storeId: store.id,
            },
          },
        },
        payments: {
          some: {
            status: 'CompletedPayment',
          },
        },
      },
      select: {
        id: true,
        items: {
          where: {
            product: {
              storeId: store.id,
            },
          },
          select: {
            price: true,
            quantity: true,
          },
        },
      },
    });

    return orders;
  };
}

export default new DashboardRepository();
