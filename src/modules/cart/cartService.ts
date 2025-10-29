import cartRepository from '@modules/cart/cartRepo';
import { CreatedCartDto, GetCartDto } from '@modules/cart/dto/cartDTO';

class CartService {
  // 장바구니 생성 또는 기존 장바구니 반환
  createOrGetCart = async (userId: string): Promise<CreatedCartDto> => {
    // 기존 장바구니 조회
    let cart = await cartRepository.getByUserId(userId);

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

  // 장바구니 조회 (상세 정보 포함)
  getCart = async (userId: string): Promise<GetCartDto> => {
    // 기존 장바구니 조회
    let cart = await cartRepository.getCartWithDetails(userId);

    // 장바구니가 없으면 생성
    if (!cart) {
      // 장바구니가 없으면 빈 장바구니 생성
      const newCart = await cartRepository.create(userId);
      return {
        id: newCart.id,
        buyerId: newCart.userId,
        quantity: 0,
        createdAt: newCart.createdAt,
        updatedAt: newCart.updatedAt,
        items: [],
      };
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
      items: cart.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        sizeId: item.sizeId,
        quantity: item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
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
      })),
    };
  };
}

export default new CartService();
