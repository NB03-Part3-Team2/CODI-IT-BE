import orderRepository from '@modules/order/orderRepo';
import productRepository from '@modules/product/productRepo';
import userRepository from '@modules/user/userRepo';
import { CreateOrderDto, CreateOrderResponseDto } from '@modules/order/dto/orderDTO';
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
}

export default new OrderService();
