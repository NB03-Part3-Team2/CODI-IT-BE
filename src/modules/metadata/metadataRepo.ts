import { prisma } from '@shared/prisma';

/**
 * Metadata Repository
 * 메타데이터 관련 데이터베이스 접근 레이어
 */
class MetadataRepository {
  /**
   * 모든 등급 정보 조회
   * @returns Grade 목록 (minAmount 오름차순)
   */
  getGradeList = async () => {
    return await prisma.grade.findMany({
      orderBy: {
        minAmount: 'asc',
      },
    });
  };
}

export const metadataRepository = new MetadataRepository();
