import { Request, Response } from 'express';
import cartService from '@modules/cart/cartService';

class CartController {
  /**
   * 장바구니를 생성하거나 조회합니다.
   *
   * 사용자 ID를 기반으로 장바구니를 생성하거나 기존 장바구니를 조회합니다.
   * 인증된 사용자만 접근 가능하며, 장바구니가 없으면 새로 생성됩니다.
   * 서버 오류로 인해 장바구니 생성/조회에 실패할 수 있습니다.
   *
   * @param req - 요청 객체
   * @param res - 응답 객체
   *
   * @returns 장바구니 정보 (HTTP 201)
   *
   * @throws {ApiError} 401 - 인증되지 않은 사용자
   * @throws {ApiError} 500 - 서버 내부 오류
   */
  postCart = async (req: Request, res: Response) => {
    // 인증 미들웨어에서 사용자 ID 가져오기
    const userId = req.user.id;

    // 장바구니 생성 또는 조회
    const cart = await cartService.createOrGetCart(userId);

    // response 반환
    res.status(201).json(cart);
  };

  /**
   * 장바구니를 조회합니다.
   *
   * 사용자의 장바구니와 장바구니 아이템들을 조회합니다.
   * 각 아이템에는 상품, 스토어, 재고 정보가 포함됩니다.
   * 장바구니가 없으면 빈 장바구니를 생성하고 빈 items 배열을 반환합니다.
   * 인증된 사용자만 접근 가능합니다.
   *
   * @param req - 요청 객체
   * @param res - 응답 객체
   *
   * @returns 장바구니 상세 정보 (HTTP 200)
   *
   * @throws {ApiError} 401 - 인증되지 않은 사용자
   * @throws {ApiError} 500 - 서버 내부 오류
   */
  getCart = async (req: Request, res: Response) => {
    // 인증 미들웨어에서 사용자 ID 가져오기
    const userId = req.user.id;

    // 장바구니 조회
    const cart = await cartService.getCart(userId);

    // response 반환
    res.status(200).json(cart);
  };
}

export default new CartController();
