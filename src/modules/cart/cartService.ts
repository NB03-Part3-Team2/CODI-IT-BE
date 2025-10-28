import cartRepository from '@modules/cart/cartRepo';
import { CreatedCartDto } from '@modules/cart/dto/cartDTO';

class CartService {
  // 장바구니 생성 또는 기존 장바구니 반환
  createOrGetCart = async (userId: string): Promise<CreatedCartDto> => {
    // 기존 장바구니 조회
    let cart = await cartRepository.findByUserId(userId);

    // 장바구니가 없으면 생성
    if (!cart) {
      cart = await cartRepository.create(userId);
    }

    // quantity 계산 (cartItems의 총 수량 합계)
    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    // 응답 DTO로 변환 (buyerId는 userId를 매핑)
    return {
      id: cart.id,
      buyerId: cart.userId,
      quantity: totalQuantity,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  };
}

export default new CartService();
