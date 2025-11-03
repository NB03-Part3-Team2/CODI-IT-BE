import productRepository from '@modules/product/productRepo';
import storeRepository from '@modules/store/storeRepo';
import { ApiError } from '@errors/ApiError';
import { CreateProductDto } from '@modules/product/dto/productDTO';

class ProductService {
  createProduct = async (userId: string, createProductDto: CreateProductDto) => {
    const store = await storeRepository.getStoreIdByUserId(userId);
    if (!store) {
      throw ApiError.notFound('스토어를 찾을수 없습니다.');
    }

    const { categoryName, price, discountRate, ...restOfDto } = createProductDto;

    const category = await productRepository.findCategoryByName(categoryName);
    if (!category) {
      throw ApiError.notFound('존재하지 않는 카테고리 입니다.');
    }

    let discountPrice: number = price;
    if (discountRate) {
      discountPrice = Math.round(price * (1 - discountRate / 100));
    }
    // DB 삽입에 필요한 데이터 재정의
    const productData = {
      ...restOfDto,
      price,
      discountRate,
      discountPrice,
      categoryId: category.id,
      stocks: createProductDto.stocks,
    };

    const product = await productRepository.create(store.id, productData);

    if (!product) {
      throw ApiError.internal('상품 생성에 실패했습니다.');
    }

    const { reviews, stocks, ...restOfProduct } = product;

    // 리뷰 점수에 따른 분류 시작
    const ratingCountsArray = [0, 0, 0, 0, 0];
    // 리뷰 점수 총합
    let sumScore = 0;
    // 리뷰가 없으면 건너뛰기
    if (reviews) {
      for (const review of reviews) {
        // 각 평점별로 인덱스에 맞게 값 넣어주기
        ratingCountsArray[review.rating - 1]++;
        // 총점에 더하기
        sumScore += review.rating;
      }
    }
    // 배열로 정렬된 값을 리스폰스 형태에 맞게 가공
    const ratingCounts: { [key: string]: number } = {};
    for (let i = 0; i < 5; i++) {
      ratingCounts[`rate${i + 1}Length`] = ratingCountsArray[i];
    }
    ratingCounts['sumScore'] = sumScore;

    // 리뷰 평균 점수 구하기
    let reviewsRating = 0;
    if (reviews && reviews.length > 0) {
      reviewsRating = sumScore / reviews.length;
    }

    // stocks 필드 en을 name으로 변경
    const transformedStocks = stocks.map((stock) => ({
      id: stock.id,
      quantity: stock.quantity,
      size: {
        id: stock.size.id,
        name: stock.size.en,
      },
    }));

    // isSoldOut 계산
    const totalQuantity = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
    const isSoldOut = totalQuantity === 0; // 수량이 0이면 true 아니면 false

    return {
      ...restOfProduct,
      storeName: store.name,
      stocks: transformedStocks,
      reviewsRating,
      reviews: ratingCounts,
      isSoldOut,
    };
  };
}

export default new ProductService();
