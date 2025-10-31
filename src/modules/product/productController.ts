import { Request, Response } from 'express';
import productService from '@modules/product/productService';
import { CreateProductDto } from '@modules/product/dto/productDTO';
import { uploadToS3 } from '@modules/s3/utils/s3Utils';

class ProductController {
  postProduct = async (req: Request, res: Response) => {
    const userId = req.user.id;
    let imageUrl: string | null = null;

    // 1. 이미지 파일이 있으면 S3에 업로드
    if (req.file) {
      const { url } = await uploadToS3(req.file);
      imageUrl = url;
      // imageUrl = 'http://www.parsingSuccess.com';
    }

    // 2. DTO 생성 (validator에서 파싱된 body를 사용)
    const createProductDto: CreateProductDto = {
      ...req.body,
      image: imageUrl,
    };

    const product = await productService.createProduct(userId, createProductDto);

    res.status(201).json(product);
  };
}

export default new ProductController();
