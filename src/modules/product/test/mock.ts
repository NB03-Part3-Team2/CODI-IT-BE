import { CreateProductDto } from '@modules/product/dto/productDTO';

export const userId = 'test-user-id';
export const storeId = 'test-store-id';
export const categoryId = 'test-category-id';
export const stockId = 'test-stock-id';
export const sizeId = 1;

export const createProductDto: CreateProductDto = {
  categoryName: '상의',
  name: '테스트 상품',
  price: 30000,
  image: 'https://example.com/product.jpg',
  content: '테스트 상품입니다.',
  discountRate: 10,
  discountStartTime: new Date('2025-01-01'),
  discountEndTime: new Date('2025-12-31'),
  stocks: [
    {
      sizeId: sizeId,
      quantity: 100,
    },
  ],
};

export const mockStore = {
  id: storeId,
  name: '테스트 스토어',
};

export const mockCategory = {
  id: categoryId,
  name: 'TOP',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockProduct = {
  id: 'product-id-1',
  storeId: storeId,
  categoryId: categoryId,
  name: '테스트 상품',
  content: '테스트 상품입니다.',
  image: 'https://example.com/product.jpg',
  price: 30000,
  discountPrice: 27000,
  discountRate: 10,
  discountStartTime: new Date('2025-01-01'),
  discountEndTime: new Date('2025-12-31'),
  createdAt: new Date(),
  updatedAt: new Date(),
  reviews: [],
  category: {
    id: mockCategory.id,
    name: mockCategory.name,
  },
  stocks: [
    {
      id: stockId,
      productId: 'product-id-1',
      sizeId: sizeId,
      quantity: 100,
      size: {
        id: sizeId,
        en: 'M',
      },
    },
  ],
  inquiries: [],
};
