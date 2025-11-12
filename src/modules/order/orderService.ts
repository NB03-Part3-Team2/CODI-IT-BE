import orderRepository from '@modules/order/orderRepo';
import productRepository from '@modules/product/productRepo';
import userRepository from '@modules/user/userRepo';
import {
  CreateOrderDto,
  CreateOrderResponseDto,
  GetOrdersQueryDto,
  GetOrdersResponseDto,
} from '@modules/order/dto/orderDTO';
import { ApiError } from '@errors/ApiError';

class OrderService {
  // 주문 생성
  createOrder = async (userId: string, data: CreateOrderDto): Promise<CreateOrderResponseDto> => {
    const { name, phone, address, orderItems, usePoint } = data;

    // 1. 주문 아이템이 비어있는지 확인
    if (orderItems.length === 0) {
      throw ApiError.badRequest('주문 아이템이 없습니다.');
    }

    // 2. 재고 확인 및 가격 계산
    let subtotal = 0;
    let totalQuantity = 0;
    const orderItemsWithPrice = [];

    for (const item of orderItems) {
      // 재고 확인은 트랜잭션 내에서 처리하지만, 가격 정보는 미리 조회
      const priceInfo = await productRepository.getProductPriceInfo(item.productId);
      if (!priceInfo) {
        throw ApiError.notFound(`상품 ID ${item.productId}를 찾을 수 없습니다.`);
      }

      // 할인 적용 가격 계산
      let finalPrice = priceInfo.price;
      const now = new Date();

      if (
        priceInfo.discountRate > 0 &&
        priceInfo.discountStartTime &&
        priceInfo.discountEndTime &&
        now >= priceInfo.discountStartTime &&
        now <= priceInfo.discountEndTime
      ) {
        finalPrice = Math.floor(priceInfo.price * (1 - priceInfo.discountRate / 100));
      }

      orderItemsWithPrice.push({
        productId: item.productId,
        sizeId: item.sizeId,
        price: finalPrice,
        quantity: item.quantity,
      });

      subtotal += finalPrice * item.quantity;
      totalQuantity += item.quantity;
    }

    // 4. 포인트 사용 검증
    if (usePoint > 0) {
      const userPoints = await userRepository.getUserPoints(userId);
      if (userPoints < usePoint) {
        throw ApiError.badRequest(
          `사용 가능한 포인트가 부족합니다. (보유: ${userPoints}, 요청: ${usePoint})`,
        );
      }
      if (usePoint > subtotal) {
        throw ApiError.badRequest('사용 포인트는 주문 금액을 초과할 수 없습니다.');
      }
    }

    // 3. 최종 결제 금액 계산
    const paymentPrice = subtotal - usePoint;

    // 4. 주문 데이터 준비
    const orderData = {
      userId,
      name,
      address,
      phoneNumber: phone,
      subtotal,
      totalQuantity,
      usePoint,
    };

    // 5. 주문 생성 (트랜잭션 처리)
    const createdOrder = await orderRepository.createOrder(
      orderData,
      orderItemsWithPrice,
      paymentPrice,
    );

    if (!createdOrder) {
      throw ApiError.internal('주문 생성에 실패했습니다.');
    }

    // 6. 응답 DTO로 변환
    return {
      id: createdOrder.id,
      userId: createdOrder.userId,
      name: createdOrder.name,
      address: createdOrder.address,
      phoneNumber: createdOrder.phoneNumber,
      subtotal: createdOrder.subtotal,
      totalQuantity: createdOrder.totalQuantity,
      usePoint: createdOrder.usePoint,
      createdAt: createdOrder.createdAt,
      updatedAt: createdOrder.updatedAt,
      orderItems: createdOrder.items.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        sizeId: item.sizeId,
        price: item.price,
        quantity: item.quantity,
        isReviewed: item.isReviewed,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
        },
        size: {
          id: item.size.id,
          size: {
            en: item.size.en,
            ko: item.size.ko,
          },
        },
      })),
      payments: {
        id: createdOrder.payments[0].id,
        orderId: createdOrder.payments[0].orderId,
        price: createdOrder.payments[0].price,
        status: createdOrder.payments[0].status,
        createdAt: createdOrder.payments[0].createdAt,
        updatedAt: createdOrder.payments[0].updatedAt,
      },
    };
  };

  // 주문 취소
  deleteOrder = async (userId: string, orderId: string): Promise<null> => {
    // 1. 주문 조회
    const order = await orderRepository.getOrderById(orderId);

    // 2. 주문 존재 확인
    if (!order) {
      throw ApiError.notFound('주문을 찾을 수 없습니다.');
    }

    // 3. 사용자 권한 확인 (본인 주문인지)
    if (order.userId !== userId) {
      throw ApiError.forbidden('사용자를 찾을 수 없습니다.');
    }

    // 4. 결제 정보 확인
    if (!order.payments || order.payments.length === 0) {
      throw ApiError.internal('결제 정보를 찾을 수 없습니다.');
    }

    // 5. 주문 상태 확인 (CompletedPayment인지)
    const paymentStatus = order.payments[0].status;
    if (paymentStatus !== 'CompletedPayment') {
      throw ApiError.badRequest('결제 완료된 주문만 취소할 수 있습니다.');
    }

    // 6. 주문 취소 (트랜잭션 처리)
    await orderRepository.deleteOrder(orderId, userId, order.items, order.usePoint);

    return null;
  };

  // 주문 목록 조회
  getOrders = async (userId: string, query: GetOrdersQueryDto): Promise<GetOrdersResponseDto> => {
    // Repository에서 주문 목록 조회
    const { orders, total, page, limit } = await orderRepository.getOrders(userId, query);

    // 응답 DTO로 변환
    const data = orders.map((order) => ({
      id: order.id,
      name: order.name,
      phoneNumber: order.phoneNumber,
      address: order.address,
      subtotal: order.subtotal,
      totalQuantity: order.totalQuantity,
      usePoint: order.usePoint,
      createdAt: order.createdAt,
      orderItems: order.items.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        productId: item.productId,
        product: {
          id: item.product.id,
          storeId: item.product.storeId,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          discountRate: item.product.discountRate,
          discountStartTime: item.product.discountStartTime,
          discountEndTime: item.product.discountEndTime,
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt,
          store: {
            id: item.product.store.id,
            userId: item.product.store.userId,
            name: item.product.store.name,
            address: item.product.store.address,
            phoneNumber: item.product.store.phoneNumber,
            content: item.product.store.content,
            image: item.product.store.image,
            createdAt: item.product.store.createdAt,
            updatedAt: item.product.store.updatedAt,
          },
          stocks: item.product.stocks.map((stock) => ({
            id: stock.id,
            productId: stock.productId,
            sizeId: stock.sizeId,
            quantity: stock.quantity,
            size: {
              id: stock.size.id,
              size: {
                en: stock.size.en,
                ko: stock.size.ko,
              },
            },
          })),
        },
        size: {
          id: item.size.id,
          size: {
            en: item.size.en,
            ko: item.size.ko,
          },
        },
        isReviewed: item.isReviewed,
      })),
      payments: {
        id: order.payments[0].id,
        price: order.payments[0].price,
        status: order.payments[0].status,
        createdAt: order.payments[0].createdAt,
        updatedAt: order.payments[0].updatedAt,
        orderId: order.payments[0].orderId,
      },
    }));

    // 메타 데이터 계산
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  };
}

export default new OrderService();
