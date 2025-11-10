import { z } from 'zod';

export const createInquirySchema = z.object({
  title: z.string().min(1, '제목은 1자 이상이여야 합니다'),
  content: z.string().min(1, '내용은 1자 이상이여야 합니다'),
  isSecret: z.boolean().default(false),
});

export type CreateInquiryDTO = z.infer<typeof createInquirySchema>;
