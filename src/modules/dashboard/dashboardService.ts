import dashboardRepo from '@modules/dashboard/dashboardRepo';
import {
  DashboardResponseDto,
  PeriodStats,
  PriceRangeItem,
} from '@modules/dashboard/dto/dashboardDTO';
import { UserType } from '@prisma/client';
import { ApiError } from '@errors/ApiError';
import { prisma } from '@shared/prisma';
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
} from 'date-fns';

class DashboardService {
  /**
   * 날짜 범위 계산 유틸리티
   * date-fns를 사용하여 기간별 시작/종료 날짜를 계산합니다.
   */
  private getDateRanges() {
    const now = new Date();

    return {
      today: {
        current: { start: startOfDay(now), end: endOfDay(now) },
        previous: { start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) },
      },
      week: {
        current: {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
        },
        previous: {
          start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
          end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
        },
      },
      month: {
        current: { start: startOfMonth(now), end: endOfMonth(now) },
        previous: { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) },
      },
      year: {
        current: { start: startOfYear(now), end: endOfYear(now) },
        previous: { start: startOfYear(subYears(now, 1)), end: endOfYear(subYears(now, 1)) },
      },
    };
  }

  /**
   * 변화율 계산
   * @param current - 현재 값
   * @param previous - 이전 값
   * @returns 변화율 (%)
   */
  private calculateChangeRate(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * 기간별 통계 조회
   * @param sellerId - 판매자 ID
   * @param currentStart - 현재 기간 시작
   * @param currentEnd - 현재 기간 종료
   * @param previousStart - 이전 기간 시작
   * @param previousEnd - 이전 기간 종료
   */
  private async getPeriodStats(
    sellerId: string,
    currentStart: Date,
    currentEnd: Date,
    previousStart: Date,
    previousEnd: Date,
  ): Promise<PeriodStats> {
    // 현재 기간 통계
    const current = await dashboardRepo.getOrderStatsByPeriod(sellerId, currentStart, currentEnd);

    // 이전 기간 통계
    const previous = await dashboardRepo.getOrderStatsByPeriod(
      sellerId,
      previousStart,
      previousEnd,
    );

    // 변화율 계산
    const changeRate = {
      totalOrders: this.calculateChangeRate(current.totalOrders, previous.totalOrders),
      totalSales: this.calculateChangeRate(current.totalSales, previous.totalSales),
    };

    return { current, previous, changeRate };
  }

  /**
   * 가격 범위 분류
   * @param amount - 금액
   */
  private getPriceRangeLabel(amount: number): string {
    if (amount <= 20000) return '~20,000원';
    if (amount <= 50000) return '~50,000원';
    if (amount <= 100000) return '~100,000원';
    if (amount <= 200000) return '~200,000원';
    return '200,000원~';
  }

  /**
   * 가격 범위별 매출 계산
   * @param sellerId - 판매자 ID
   */
  private async calculatePriceRanges(sellerId: string): Promise<PriceRangeItem[]> {
    const orders = await dashboardRepo.getAllCompletedOrders(sellerId);

    // 가격 범위별 매출 집계
    const rangeMap = new Map<string, number>();
    let totalSales = 0;

    for (const order of orders) {
      const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      totalSales += orderTotal;

      const rangeLabel = this.getPriceRangeLabel(orderTotal);
      rangeMap.set(rangeLabel, (rangeMap.get(rangeLabel) || 0) + orderTotal);
    }

    // 결과 배열 생성 (정해진 순서대로)
    const priceRanges = ['~20,000원', '~50,000원', '~100,000원', '~200,000원', '200,000원~'];
    const result: PriceRangeItem[] = priceRanges.map((range) => {
      const sales = rangeMap.get(range) || 0;
      const percentage = totalSales > 0 ? Math.round((sales / totalSales) * 100 * 10) / 10 : 0;
      return {
        priceRange: range,
        totalSales: sales,
        percentage,
      };
    });

    return result;
  }

  /**
   * 대시보드 데이터 조회
   * @param sellerId - 판매자(사용자) ID
   */
  getDashboard = async (sellerId: string): Promise<DashboardResponseDto> => {
    // 1. 사용자 타입 검증 (SELLER인지 확인)
    const user = await prisma.user.findUnique({
      where: { id: sellerId },
      select: { type: true },
    });

    if (!user) {
      throw ApiError.notFound('사용자를 찾을 수 없습니다.');
    }

    if (user.type !== UserType.SELLER) {
      throw ApiError.forbidden('대시보드는 판매자만 접근할 수 있습니다.');
    }

    // 2. 날짜 범위 계산
    const dateRanges = this.getDateRanges();

    // 3. 병렬 처리로 성능 최적화
    const [today, week, month, year, topSales, priceRange] = await Promise.all([
      this.getPeriodStats(
        sellerId,
        dateRanges.today.current.start,
        dateRanges.today.current.end,
        dateRanges.today.previous.start,
        dateRanges.today.previous.end,
      ),
      this.getPeriodStats(
        sellerId,
        dateRanges.week.current.start,
        dateRanges.week.current.end,
        dateRanges.week.previous.start,
        dateRanges.week.previous.end,
      ),
      this.getPeriodStats(
        sellerId,
        dateRanges.month.current.start,
        dateRanges.month.current.end,
        dateRanges.month.previous.start,
        dateRanges.month.previous.end,
      ),
      this.getPeriodStats(
        sellerId,
        dateRanges.year.current.start,
        dateRanges.year.current.end,
        dateRanges.year.previous.start,
        dateRanges.year.previous.end,
      ),
      dashboardRepo.getTopSellingProducts(sellerId, 5),
      this.calculatePriceRanges(sellerId),
    ]);

    return {
      today,
      week,
      month,
      year,
      topSales,
      priceRange,
    };
  };
}

export default new DashboardService();
