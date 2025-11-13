/**
 * ============================================
 * Notification 모듈 사용 예시
 * ============================================
 */

import notificationService from '@modules/notification/notificationService';

// ============================================
// 1. 문의 답변 달렸을 때 (inquiryService.ts)
// ============================================
/*
async createAnswer(inquiryId: string, answer: string, sellerId: string) {
  const inquiry = await inquiryRepository.findById(inquiryId);
  
  assert(inquiry, ApiError.notFound('문의를 찾을 수 없습니다.'));
  assert(inquiry.sellerId === sellerId, ApiError.forbidden('권한이 없습니다.'));
  
  // 답변 저장
  const updatedInquiry = await inquiryRepository.updateAnswer(inquiryId, answer);
  
  // ⭐ 문의 작성자에게 실시간 알림
  await notificationService.notifyInquiryAnswered(updatedInquiry);
  
  return updatedInquiry;
}
*/

// ============================================
// 2. 새 문의 등록되었을 때 (inquiryService.ts)
// ============================================
/*
async createInquiry(createInquiryDto: CreateInquiryDto) {
  const inquiry = await inquiryRepository.create(createInquiryDto);
  const product = await productRepository.findById(inquiry.productId);
  
  // ⭐ 판매자에게 실시간 알림
  await notificationService.notifyNewInquiry(inquiry, product);
  
  return inquiry;
}
*/

// ============================================
// 3. 상품 품절되었을 때 (productService.ts)
// ============================================
/*
async updateStock(productId: string, quantity: number) {
  const product = await productRepository.findById(productId);
  const newStock = product.stock - quantity;
  
  await productRepository.updateStock(productId, newStock);
  
  // ⭐ 품절 되는 순간에만 알림
  if (product.stock > 0 && newStock <= 0) {
    // 장바구니에 담은 유저들 조회
    const cartUserIds = await cartRepository.findUserIdsByProductId(productId);
    
    // 판매자 + 구매자들에게 알림
    await notificationService.notifyOutOfStock(productId, product, cartUserIds);
  }
  
  return newStock;
}
*/

// ============================================
// 4. 직접 알림 생성 (필요시)
// ============================================
/*
await notificationService.create({
  userId: 'user123',
  content: '커스텀 알림 메시지입니다.',
});
*/
