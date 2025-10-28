// 장바구니 생성 응답 DTO (buyerId는 userId를 매핑한 것)
export interface CreatedCartDTO {
  id: string;
  buyerId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
