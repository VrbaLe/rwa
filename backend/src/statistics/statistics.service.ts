import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from, map } from 'rxjs';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { OwnerStats, SalonStat, TreatmentStat } from './dto/owner-stats.dto';

const pad = (value: number): string => String(value).padStart(2, '0');
const toIso = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const dateOf = (appointment: Appointment): string => String(appointment.appointmentDate).slice(0, 10);
const priceOf = (appointment: Appointment): number => appointment.treatment?.price ?? 0;
const sum = (list: Appointment[]): number => list.reduce((total, a) => total + priceOf(a), 0);

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  ownerStats(userId: number): Observable<OwnerStats> {
    return from(
      this.appointmentRepository.find({
        where: { salon: { owner: { user: { id: userId } } } },
        relations: { salon: true, treatment: true },
      }),
    ).pipe(map((appointments) => this.calculate(appointments)));
  }

  private calculate(appointments: Appointment[]): OwnerStats {
    const now = new Date();
    const today = toIso(now);
    const month = today.slice(0, 7);
    const year = today.slice(0, 4);

    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const weekStart = toIso(monday);

    const done = appointments.filter((a) => dateOf(a) <= today);
    const upcoming = appointments.filter((a) => dateOf(a) > today);

    const doneToday = done.filter((a) => dateOf(a) === today);
    const doneWeek = done.filter((a) => dateOf(a) >= weekStart);
    const doneMonth = done.filter((a) => dateOf(a).startsWith(month));
    const doneYear = done.filter((a) => dateOf(a).startsWith(year));

    const daily = Array.from({ length: 30 }, (_, index) => {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (29 - index));
      const date = toIso(day);
      const list = done.filter((a) => dateOf(a) === date);
      return { date, revenue: sum(list), appointments: list.length };
    });

    const monthly = Array.from({ length: 12 }, (_, index) => {
      const first = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
      const key = `${first.getFullYear()}-${pad(first.getMonth() + 1)}`;
      const list = done.filter((a) => dateOf(a).startsWith(key));
      return { month: key, revenue: sum(list), appointments: list.length };
    });

    const byTreatment = new Map<string, TreatmentStat>();
    const bySalon = new Map<number, SalonStat>();

    done.forEach((appointment) => {
      const name = appointment.treatment?.name ?? 'Bez usluge';
      const treatment = byTreatment.get(name) ?? { name, count: 0, revenue: 0 };
      treatment.count += 1;
      treatment.revenue += priceOf(appointment);
      byTreatment.set(name, treatment);

      const salonId = appointment.salon.id;
      const salon = bySalon.get(salonId) ?? {
        salonId,
        salonName: appointment.salon.name,
        revenue: 0,
        appointments: 0,
      };
      salon.appointments += 1;
      salon.revenue += priceOf(appointment);
      bySalon.set(salonId, salon);
    });

    return {
      summary: {
        today: sum(doneToday),
        week: sum(doneWeek),
        month: sum(doneMonth),
        year: sum(doneYear),
        total: sum(done),
        upcoming: sum(upcoming),
        appointmentsToday: doneToday.length,
        appointmentsWeek: doneWeek.length,
        appointmentsMonth: doneMonth.length,
        appointmentsTotal: done.length,
        appointmentsUpcoming: upcoming.length,
      },
      daily,
      monthly,
      topTreatments: [...byTreatment.values()].sort((a, b) => b.count - a.count).slice(0, 5),
      bySalon: [...bySalon.values()].sort((a, b) => b.revenue - a.revenue),
    };
  }
}