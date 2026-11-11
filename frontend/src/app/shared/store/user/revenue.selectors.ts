import { createSelector } from '@ngrx/store';
import { AppointmentViewDto } from '../../dtos/appointment-view.dto';
import { selectOwnerAppointments } from './profile.selectors';

export type RevenueGroup = 'day' | 'month' | 'year';

export interface RevenueRow {
  period: string;
  appointments: number;
  revenue: number;
}

const PERIOD_LENGTH: Record<RevenueGroup, number> = { day: 10, month: 7, year: 4 };

type PricedAppointment = AppointmentViewDto & { treatmentPrice?: number | null };

export const selectRevenueRows = (salonId: string, group: RevenueGroup, onlyDone: boolean) =>
  createSelector(selectOwnerAppointments, (appointments): RevenueRow[] => {
    const today = new Date().toLocaleDateString('sv-SE');

    const rows = (appointments as PricedAppointment[])
      .filter((appointment) => salonId === 'all' || String(appointment.salonId) === salonId)
      .filter((appointment) => !onlyDone || appointment.appointmentDate <= today)
      .reduce((groups, appointment) => {
        const period = appointment.appointmentDate.slice(0, PERIOD_LENGTH[group]);
        const row = groups.get(period) ?? { period, appointments: 0, revenue: 0 };
        row.appointments += 1;
        row.revenue += appointment.treatmentPrice ?? 0;
        return groups.set(period, row);
      }, new Map<string, RevenueRow>());

    return [...rows.values()].sort((a, b) => b.period.localeCompare(a.period));
  });