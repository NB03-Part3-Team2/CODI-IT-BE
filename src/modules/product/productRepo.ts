import { prisma } from '@shared/prisma';
import { CreateProductDto } from '@modules/product/dto/productDTO';

class ProductRepository {
  create = async (storeId: string, createProductDto: any) => {
    const { stocks, ...productData } = createProductDto;

    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          storeId,
          ...productData,
        },
      });

      const stockData = stocks.map((stock: any) => ({
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
