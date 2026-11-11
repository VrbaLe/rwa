export interface StatsSummaryDto {
  today: number;
  week: number;
  month: number;
  year: number;
  total: number;
  upcoming: number;
  appointmentsToday: number;
  appointmentsWeek: number;
  appointmentsMonth: number;
  appointmentsTotal: number;
  appointmentsUpcoming: number;
}

export interface DailyStatDto {
  date: string;
  revenue: number;
  appointments: number;
}

export interface MonthlyStatDto {
  month: string;
  revenue: number;
  appointments: number;
}

export interface TreatmentStatDto {
  name: string;
  count: number;
  revenue: number;
}

export interface SalonStatDto {
  salonId: number;
  salonName: string;
  revenue: number;
  appointments: number;
}

export interface OwnerStatsDto {
  summary: StatsSummaryDto;
  daily: DailyStatDto[];
  monthly: MonthlyStatDto[];
  topTreatments: TreatmentStatDto[];
  bySalon: SalonStatDto[];
}