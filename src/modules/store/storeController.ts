import { Request, Response } from 'express';
import storeService from '@store/storeService';
import { CreateStoreDTO, UpdateStoreDTO } from '@store/dto/storeDTO';

class StoreController {
  // post 메소드를 예시로 들겠습니다
  postStore = async (req: Request, res: Response) => {
    // 전달할 파라미터 및 DTO 정의
    const userId = 'cmh494web0009weywagl76dvl'; // 인증 미들웨어 후 가져오는 로직으로 추후 변경
    const createStoreDTO: CreateStoreDTO = {
      name: req.body.name,
      address: req.body.address,
      detailAddress: req.body.detailAddress,
      phoneNumber: req.body.phoneNumber,
      content: req.body.content,
      image: req.body.image ?? null, // 프론트가 어떻게 구현되있을지 모르므로 undefined나 null일 경우 null로 되도록
    };

    // 스토어 생성
    const store = await storeService.createStore(userId, createStoreDTO); // service 함수 호출부 입니다.

    // response 반환
    res.status(201).json(store);
  };

  patchStore = async (req: Request, res: Response) => {
    console.log('테스트');
    // 전달할 파라미터 및 DTO 정의
    const userId = 'cmh494web0009weywagl76dvl';
    const storeId = req.params.storeId;
    const updateStoreDTO: UpdateStoreDTO = {
      name: req.body.name,
      address: req.body.address,
      detailAddress: req.body.detailAddress,
      phoneNumber: req.body.phoneNumber,
      content: req.body.content,
      image: req.body.image,
    };

    // 스토어 업데이트
    const store = await storeService.updateStore(userId, storeId, updateStoreDTO); // service 함수 호출부 입니다.

    // resposn 반환
    res.status(200).json(store);
  };
}

export default new StoreController(); // default import로 객체처럼 사용하기 위해 인스턴스를 만들어 export 합니다.
