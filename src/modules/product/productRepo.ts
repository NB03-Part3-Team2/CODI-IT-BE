import { prisma } from '@shared/prisma';
import { StockDto, CreateProductRepoDto } from '@modules/product/dto/productDTO';

class ProductRepository {
  create = async (storeId: string, productData: CreateProductRepoDto) => {
    const { stocks, ...restProductData } = productData;

    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          storeId,
          ...restProductData,
        },
      });

      const stockData = stocks.map((stock: StockDto) => ({
        ...stock,
        productId: product.id,
      }));

      await tx.stock.createMany({
        data: stockData,
      });

      return await tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          stocks: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              size: {
                select: {
                  id: true,
                  en: true,
                },
              },
            },
          },
          inquiries: true,
          reviews: true,
        },
      });
    });
  };

  findCategoryByName = async (name: string) => {
    return await prisma.category.findUnique({
      where: {
        name,
      },
    });
  };

  /**
   * CartService에서 사용하는 메소드입니다.
   * 작성자: 박재성 (Cart API 담당)
   * - checkProductExists: 상품 존재 여부 확인
   * - getStock: 재고 확인
   */

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
}

export default new ProductRepository();
