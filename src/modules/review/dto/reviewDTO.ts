import { z } from 'zod';

export const createReviewSchema = z.object({
  productId: z.cuid('유효한 상품 ID 형식이어야 합니다.'),
  rating: z.coerce.number().min(1).max(5, '평점은 1에서 5 사이여야 합니다.'),
  content: z.string().min(10, '리뷰는 최소 10자 이상이어야 합니다'),
});

export const orderItemIdSchema = z.object({
  orderItemId: z.cuid('유효한 주문 상품 ID 형식이어야 합니다.'),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema> & {
  userId: string;
  orderItemId: string;
};

export const updateReviewSchema = createReviewSchema.omit({ productId: true, orderItemId: true });

export const reviewIdSchema = z.object({
  reviewId: z.cuid('유효한 리뷰 ID 형식이어야 합니다.'),
});

export type UpdateReviewDto = z.infer<typeof updateReviewSchema> & {
  userId: string;
  reviewId: string;
};

export type ResReviewDto = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  content: string;
  createdAt: Date;
};
