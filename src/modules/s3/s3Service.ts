import { UploadImageDTO, UploadResponseDTO } from './dto/s3DTO';
import { uploadToS3 } from './utils/s3Utils';

class S3Service {
  /**
   * 이미지를 S3에 업로드하고 결과를 반환합니다.
   *
   * 업로드할 이미지 정보를 받아 S3에 파일을 업로드합니다.
   * 타임스탬프가 포함된 고유한 파일명으로 저장됩니다.
   * 업로드 실패 시 ApiError를 발생시킵니다.
   *
   * @param {UploadImageDTO} uploadImageDTO - 업로드할 이미지 정보가 포함된 DTO
   *
   * @returns {Promise<UploadResponseDTO>} 업로드 성공 메시지와 S3 URL, 키 정보
   *
   * @throws {ApiError} 500 - S3 업로드 실패
   */
  uploadImage = async (uploadImageDTO: UploadImageDTO): Promise<UploadResponseDTO> => {
    const { image } = uploadImageDTO;

    // S3에 파일 업로드
    const { url, key } = await uploadToS3(image);

    return { message: '업로드 성공', url, key };
  };
}

export default new S3Service();
