export class StatsSummary {
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

export class DailyStat {
    date: string;
    revenue: number;
    appointments: number;
}

export class MonthlyStat {
    month: string;
    revenue: number;
    appointments: number;
}

export class TreatmentStat {
    name: string;
    count: number;
    revenue: number;
}

export class SalonStat {
    salonId: number;
    salonName: string;
    revenue: number;
    appointments: number;
}

export class OwnerStats {
    summary: StatsSummary;
    daily: DailyStat[];
    monthly: MonthlyStat[];
    topTreatments: TreatmentStat[];
    bySalon: SalonStat[];
}