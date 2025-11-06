import { Request, Response } from 'express';
import productService from '@modules/product/productService';
import {
  CreateProductDto,
  GetProductListDto,
  UpdateProductDto,
} from '@modules/product/dto/productDTO';

class ProductController {
  postProduct = async (req: Request, res: Response) => {
    // 1. DTO 생성 (validator + 인증 미들웨어로 검증한 데이터 사용)
    const userId = req.user.id;
    const createProductDto: CreateProductDto = { ...req.validatedBody };

    // 2. 상품 목록 조회
    const product = await productService.createProduct(userId, createProductDto);

    res.status(201).json(product);
  };

  getProductList = async (req: Request, res: Response) => {
    // 1. DTO 생성 (validator로 검증한 데이터 사용)
    const getProductListDto: GetProductListDto = { ...req.validatedQuery };

    // 2. 상품 목록 조회
    const products = await productService.getProductList(getProductListDto);

    res.status(200).json(products);
  };

  updateProduct = async (req: Request, res: Response) => {
    // 1. DTO 생성 (validator + 인증 미들웨어로 검증한 데이터 사용)
    const userId = req.user.id;
    const { id: productId } = req.validatedParams;
    const updateProductDto: UpdateProductDto = { ...req.validatedBody };

    // 2. 상품 수정
    const product = await productService.updateProduct(userId, productId, updateProductDto);

    res.status(200).json(product);
  };
}

export default new ProductController();
