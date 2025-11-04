import productRepository from '@modules/product/productRepo';
import storeRepository from '@modules/store/storeRepo';
import { ApiError } from '@errors/ApiError';
import {
  CreateProductDto,
  CreateProductResponseDto,
  GetProductListDto,
} from '@modules/product/dto/productDTO';
import { CATEGORY_NAMES } from '@modules/product/dto/productConstant';

class ProductService {
  createProduct = async (
    userId: string,
    createProductDto: CreateProductDto,
  ): Promise<CreateProductResponseDto> => {
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
      discountRate: discountRate ?? 0,
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

  getProductList = async (getProductListDto: GetProductListDto) => {
    const { categoryName } = getProductListDto;

    // 상품을 찾을 수 없을때는 빈 배열 + count 0이므로 에러 x
    // 올바르지 않은 카테고리가 들어왔을 경우 404 에러
    if (categoryName && !CATEGORY_NAMES.includes(categoryName as any)) {
      throw ApiError.notFound('존재하지 않는 카테고리 입니다.');
    }

    // 레포지토리 함수 호출 : 상품들 정보, 전체 상품 개수
    const totalCount = await productRepository.getProductCount(getProductListDto);
    const products = await productRepository.getProductList(getProductListDto);

    // 반환 형태에 맞게 가공
    const formattedProducts = products.map((product) => {
      // Prisma 쿼리 결과에서 필요한 속성들을 추출합니다。
      const { reviews, stocks, store, orderItems, category, content, ...restOfProduct } = product;

      // 1. 리뷰 개수 계산: 해당 상품에 달린 리뷰의 총 개수
      const reviewsCount = reviews.length;
      // 2. 리뷰 평균 점수 계산: 리뷰가 있을 경우에만 계산하며, 없을 경우 0으로 설정
      let reviewsRating = 0;
      if (reviewsCount > 0) {
        const sumScore = reviews.reduce((sum, review) => sum + review.rating, 0);
        reviewsRating = sumScore / reviewsCount;
      }

      // 3. 판매량 계산: 해당 상품의 모든 주문 항목(orderItems)의 수량을 합산
      const sales = orderItems.reduce((sum, item) => sum + item.quantity, 0);

      // 4. 품절 여부 계산: 모든 재고(stocks)의 총 수량이 0이면 품절
      const totalQuantity = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
      const isSoldOut = totalQuantity === 0;

      // 최종적으로 클라이언트에 반환될 상품 정보를 구성합니다。
      return {
        ...restOfProduct, // 기본적으로 받은 정보 사용
        discountPrice: restOfProduct.discountPrice ?? 0, // null로 저장될 수 있으므로 없는 경우 0 반환
        storeName: store.name, // 스토어 이름
        reviewsCount, // 총 리뷰 개수
        reviewsRating, // 평균 리뷰 점수
        sales, // 총 판매량
        isSoldOut, // 품절 여부
      };
    });

    return {
      list: formattedProducts,
      totalCount,
    };
  };
}

export default new ProductService();
