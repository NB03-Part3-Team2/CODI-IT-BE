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
}

export default new ProductRepository();
