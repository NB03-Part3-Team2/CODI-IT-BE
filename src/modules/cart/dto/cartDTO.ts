// 장바구니 생성 응답 DTO (buyerId는 userId를 매핑한 것)
export interface CreatedCartDto {
  id: string;
  buyerId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// 장바구니 조회 응답 DTO
export interface GetCartDto {
  id: string;
  buyerId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  items: CartItemDto[];
}

export interface CartItemDto {
  id: string;
  cartId: string;
  productId: string;
  sizeId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: ProductInCartDto;
}

export interface ProductInCartDto {
  id: string;
  storeId: string;
  name: string;
  price: number;
  image: string | null;
  discountRate: number;
  discountStartTime: Date | null;
  discountEndTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
  store: StoreInCartDto;
  stocks: StockInCartDto[];
}

export interface StoreInCartDto {
  id: string;
  userId: string;
  name: string;
  address: string;
  phoneNumber: string;
  content: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockInCartDto {
  id: string;
  productId: string;
  sizeId: number;
  quantity: number;
  size: SizeInCartDto;
}

export interface SizeInCartDto {
  id: number;
  size: {
    en: string;
    ko: string;
  };
}
