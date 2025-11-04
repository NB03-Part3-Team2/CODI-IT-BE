import { Request, Response } from 'express';
import productService from '@modules/product/productService';
import {
  CreateProductDto,
  GetProductListDto,
  SortOptions,
  SizeOptions,
  CategoryNames,
} from '@modules/product/dto/productDTO';

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

  getProductList = async (req: Request, res: Response) => {
    // 1. DTO 생성
    const getProductListDto: GetProductListDto = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 16,
      search: (req.query.search as string) || undefined,
      sort: (req.query.sort as SortOptions) || 'highRating',
      priceMin: req.query.priceMin ? parseInt(req.query.priceMin as string) : undefined,
      priceMax: req.query.priceMax ? parseInt(req.query.priceMax as string) : undefined,
      size: (req.query.size as SizeOptions) || undefined,
      favoriteStore: (req.query.favoriteStore as string) || undefined,
      categoryName: req.query.categoryName
        ? (req.query.categoryName as string).toUpperCase()
        : undefined,
    };

    // 상품 목록 조회
    const products = await productService.getProductList(getProductListDto);

    res.status(200).json(products);
  };
}

export default new ProductController();
