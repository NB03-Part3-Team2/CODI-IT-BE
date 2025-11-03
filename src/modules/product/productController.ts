import { Request, Response } from 'express';
import productService from '@modules/product/productService';
import { CreateProductDto } from '@modules/product/dto/productDTO';

class ProductController {
  postProduct = async (req: Request, res: Response) => {
    const userId = req.user.id;

    // 1. DTO 생성 (validator에서 파싱된 body를 사용)
    const createProductDto: CreateProductDto = {
      name: req.body.name,
      categoryName: req.body.categoryName,
      price: req.body.price,
      image: req.body.image ?? null, // 프론트에서는 무조건 이미지가 오도록 되어있으나 추후 undefined가 올 경우에 대해 처리
      discountRate: req.body.discountRate,
      discountStartTime: req.body.discountStartTime,
      discountEndTime: req.body.discountEndTime,
      content: req.body.content,
      stocks: req.body.stocks,
    };

    const product = await productService.createProduct(userId, createProductDto);

    res.status(201).json(product);
  };
}

export default new ProductController();
