import { sampleDTO } from './dto/sampleDTO';

class sampleRepository {
	create = async (sampleDTO: sampleDTO) => {
		// sampleDTO의 타입은 DTO를 정의하여 수정합니다.
		/*
		데이터베이스와 상호작용하는 코드를 작성합니다.
			return await prisma.sample.create({
				data: {
					...
				}
		});
		*/
		console.log(sampleDTO);
	};
}

export default new sampleRepository();
