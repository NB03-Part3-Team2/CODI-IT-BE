import { Request, Response } from 'express';
import storeService from '@modules/store/storeService';
import { CreateStoreDto, UpdateStoreDto, GetMyProductListDto } from '@modules/store/dto/storeDTO';

class StoreController {
  postStore = async (req: Request, res: Response) => {
    // 전달할 파라미터 및 Dto 정의
    const userId = req.user.id;
    const createStoreDto: CreateStoreDto = {
      name: req.body.name,
      address: req.body.address,
      detailAddress: req.body.detailAddress,
      phoneNumber: req.body.phoneNumber,
      content: req.body.content,
      image: req.body.image ?? null, // 프론트가 어떻게 구현되있을지 모르므로 undefined나 null일 경우 null로 되도록
    };

    // 스토어 생성
    const store = await storeService.createStore(userId, createStoreDto); // service 함수 호출부 입니다.

    // response 반환
    res.status(201).json(store);
  };

  patchStore = async (req: Request, res: Response) => {
    // 전달할 파라미터 및 Dto 정의
    const userId = req.user.id;
    const storeId = req.params.storeId;
    const updateStoreDto: UpdateStoreDto = {
      name: req.body.name,
      address: req.body.address,
      detailAddress: req.body.detailAddress,
      phoneNumber: req.body.phoneNumber,
      content: req.body.content,
      image: req.body.image,
    };

    // 스토어 업데이트
    const store = await storeService.updateStore(userId, storeId, updateStoreDto); // service 함수 호출부 입니다.

    // resposn 반환
    res.status(200).json(store);
  };

  getStore = async (req: Request, res: Response) => {
    // 전달할 파라미터 및 Dto 정의
    const storeId = req.params.storeId;

    // 스토어 상세 조회
    const store = await storeService.getStore(storeId); // service 함수 호출부 입니다.

    // resposn 반환
    res.status(200).json(store);
  };

  getMyProductList = async (req: Request, res: Response) => {
    // 전달할 파라미터 및 Dto 정의
    const userId = req.user.id;
    const getMyProductListDto: GetMyProductListDto = {
      page: parseInt(req.query.page as string, 10) || 1,
      pageSize: parseInt(req.query.pageSize as string, 10) || 10,
    };
    // 스토어 등록 상품 조회
    const store = await storeService.getMyProductList(userId, getMyProductListDto); // service 함수 호출부 입니다.

    // resposn 반환
    res.status(200).json(store);
  };

  getMyStore = async (req: Request, res: Response) => {
    // 전달할 파라미터 및 Dto 정의
    const userId = req.user.id;
    // 스토어 등록 상세 조회
    const store = await storeService.getMyStore(userId); // service 함수 호출부 입니다.

    // resposn 반환
    res.status(200).json(store);
  };
}

export default new StoreController(); // default import로 객체처럼 사용하기 위해 인스턴스를 만들어 export 합니다.
