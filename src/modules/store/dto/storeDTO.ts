import { z } from 'zod';

const nameChecker = z
  .string()
  .min(2, '이름은 최소 2자 이상이어야 합니다')
  .max(20, '이름은 최대 20자 이하여야 합니다')
  .regex(/^[a-zA-Z0-9가-힣]+$/, '이름에 특수문자는 사용할 수 없습니다.');

const addressChecker = z
  .string()
  .min(8, '주소는 최소 8자 이상이어야 합니다')
  .max(200, '주소는 최대 200자 이하여야 합니다');

const detailAddressChecker = z
  .string()
  .min(1, '상세주소는 최소 1자 이상이어야 합니다')
  .max(20, '상세주소는 최대 20자 이하여야 합니다');

const contentChecker = z
  .string()
  .min(1, '내용은 최소 1자 이상이어야 합니다')
  .max(500, '내용은 최대 500자 이하여야 합니다');

const phoneNumberChecker = z
  .string()
  .regex(/^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/, '올바른 핸드폰 번호가 아닙니다');

const storeIdChecker = z.cuid({ message: '스토어 ID는 CUID 형식이어야 합니다.' });

export const createStoreSchema = z.object({
  name: nameChecker,
  address: addressChecker,
  detailAddress: detailAddressChecker,
  phoneNumber: phoneNumberChecker,
  content: contentChecker,
  image: z.url('이미지 URL 형식이 올바르지 않습니다.').nullable().optional(),
});

export const updateStoreSchema = createStoreSchema.partial();

export const storeIdSchema = z.object({
  storeId: z.cuid({ message: '사용자 ID는 CUID 형식이어야 합니다.' }),
});

export type CreateStoreDTO = z.infer<typeof createStoreSchema>;

export type UpdateStoreDTO = z.infer<typeof updateStoreSchema>;
