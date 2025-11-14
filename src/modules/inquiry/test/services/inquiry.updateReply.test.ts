import { afterEach, describe, test, expect, jest } from '@jest/globals';
import inquiryService from '@modules/inquiry/inquiryService';
import inquiryRepository from '@modules/inquiry/inquiryRepo';
import { mockUserSeller, mockInquiryReply } from '@modules/inquiry/test/mock';

describe('updateInquiryReply 메소드 테스트', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('성공', async () => {
    // 1. 테스트에 사용할 mock 데이터 생성
    const userId = mockUserSeller.id;
    const replyId = mockInquiryReply.id;
    const content = '문의 답변 수정';

    const mockInquiryReplyWithUser = {
      ...mockInquiryReply,
      user: { id: userId },
    };

    const expectedResult = { ...mockInquiryReply, content };

    // 2. 레포지토리 함수 모킹
    const getReplyByIdMock = jest
      .spyOn(inquiryRepository, 'getReplyById')
      .mockResolvedValue(mockInquiryReplyWithUser);
    const updateInquiryReplyMock = jest
      .spyOn(inquiryRepository, 'updateInquiryReply')
      .mockResolvedValue(expectedResult);

    // 3. 서비스 함수 호출
    const result = await inquiryService.updateInquiryReply(userId, replyId, content);

    // 4. 모킹된 메소드가 올바르게 호출되었는지 확인
    expect(getReplyByIdMock).toHaveBeenCalledWith(replyId);
    expect(updateInquiryReplyMock).toHaveBeenCalledWith(replyId, content);

    // 5. 서비스 메소드가 모킹된 결과를 반환하는지 확인
    expect(result).toEqual(expectedResult);
  });
});
