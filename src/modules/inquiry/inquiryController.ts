import { Request, Response } from 'express';
import inquiryService from '@modules/inquiry/inquiryService';
import { CreateInquiryDTO } from '@modules/inquiry/dto/inquiryDTO';

class InquiryController {
  /**
   * @description
   * 특정 상품의 새로운 문의를 생성합니다.
   *
   * @param {Object} req - 요청 객체
   * @param {Object} res - 응답 객체
   *
   * @returns {Object} 생성된 문의 정보 (HTTP 201)
   *
   * @throws {ApiError} 404 - 존재하지 않는 상품
   * @throws {ApiError} 500 - 서버 내부 오류
   */
  createInquiry = async (req: Request, res: Response) => {
    // 1. 파라미터 정의
    const userId = req.user.id;
    const { id: productId } = req.validatedParams;
    const createInquiryDto: CreateInquiryDTO = { ...req.validatedBody };

    // 2. 문의 생성
    const inquiry = await inquiryService.createInquiry(userId, productId, createInquiryDto);

    res.status(201).json(inquiry);
  };

  /**
   * @description
   * 특정 상품의 문의 목록을 조회합니다.
   *
   * @param {Object} req - 요청 객체
   * @param {Object} res - 응답 객체
   *
   * @returns {Object} 문의 목록 (HTTP 200)
   *
   * @throws {ApiError} 404 - 존재하지 않는 상품
   * @throws {ApiError} 500 - 서버 내부 오류
   */
  getInquiryList = async (req: Request, res: Response) => {
    // 1. 파라미터 정의
    const { id: productId } = req.validatedParams;

    // 2. 문의 목록 조회
    const inquiries = await inquiryService.getInquiryList(productId);

    res.status(200).json(inquiries);
  };
}

export default new InquiryController();
