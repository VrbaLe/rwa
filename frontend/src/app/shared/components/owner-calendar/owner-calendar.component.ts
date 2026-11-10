import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AppointmentViewDto } from '../../dtos/appointment-view.dto';
import { SalonViewDto } from '../../dtos/salon-view.dto';
import { generateTimeSlots } from '../../local-lists/working-hours.list';

// polja koja postoje tek posle koraka sa uslugama i radnim vremenom
type CalendarAppointment = AppointmentViewDto & {
  treatmentName?: string | null;
  treatmentPrice?: number | null;
};
type SalonWithHours = SalonViewDto & { openTime?: string; closeTime?: string };

interface CalendarDay {
  date: string;
  name: string;
  number: string;
  today: boolean;
}

const DAY_NAMES = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
const pad = (value: number): string => String(value).padStart(2, '0');
const toIso = (date: Date): string => date.toLocaleDateString('sv-SE');
const shortDate = (date: Date): string => `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.`;

const startOfWeek = (date: Date): Date => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
  return result;
};

@Component({
  selector: 'app-owner-calendar',
  standalone: true,
  templateUrl: './owner-calendar.component.html',
  styleUrl: './owner-calendar.component.scss'
})
export class OwnerCalendarComponent implements OnChanges {
  @Input() appointments: AppointmentViewDto[] = [];
  @Input() salons: SalonViewDto[] = [];
  @Output() cancelAppointment = new EventEmitter<number>();

  selectedSalon = 'all';
  weekStart = startOfWeek(new Date());

  days: CalendarDay[] = [];
  rows: string[] = [];
  weekLabel = '';
  weekCount = 0;

  private cells = new Map<string, CalendarAppointment[]>();

  ngOnChanges(): void {
    this.build();
  }

  previousWeek(): void {
    this.moveWeek(-7);
  }

  nextWeek(): void {
    this.moveWeek(7);
  }

  thisWeek(): void {
    this.weekStart = startOfWeek(new Date());
    this.build();
  }

  selectSalon(value: string): void {
    this.selectedSalon = value;
    this.build();
  }

  cell(date: string, time: string): CalendarAppointment[] {
    return this.cells.get(`${date}|${time}`) ?? [];
  }

  private moveWeek(offsetDays: number): void {
    const next = new Date(this.weekStart);
    next.setDate(next.getDate() + offsetDays);
    this.weekStart = next;
    this.build();
  }

  private build(): void {
    const today = toIso(new Date());

    const dates = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(this.weekStart);
      date.setDate(date.getDate() + index);
      return date;
    });

    this.days = dates.map((date, index) => ({
      date: toIso(date),
      name: DAY_NAMES[index],
      number: shortDate(date),
      today: toIso(date) === today
    }));

    const firstDay = this.days[0].date;
    const lastDay = this.days[6].date;
    this.weekLabel = `${shortDate(dates[0])} – ${shortDate(dates[6])}${dates[6].getFullYear()}`;

    // termini izabrane nedelje i izabranog salona
    const visible = (this.appointments as CalendarAppointment[]).filter(appointment =>
      appointment.appointmentDate >= firstDay &&
      appointment.appointmentDate <= lastDay &&
      (this.selectedSalon === 'all' || String(appointment.salonId) === this.selectedSalon)
    );

    this.weekCount = visible.length;

    // termini grupisani po danu i vremenu
    this.cells = new Map();
    visible.forEach(appointment => {
      const key = `${appointment.appointmentDate}|${appointment.timeSlot}`;
      this.cells.set(key, [...(this.cells.get(key) ?? []), appointment]);
    });

    // redovi kalendara: od najranijeg otvaranja do najkasnijeg zatvaranja
    const shown = (this.selectedSalon === 'all'
      ? this.salons
      : this.salons.filter(salon => String(salon.id) === this.selectedSalon)) as SalonWithHours[];

    const earliest = shown
      .map(salon => salon.openTime || '09:00')
      .reduce((a, b) => (a < b ? a : b), '23:59');
    const latest = shown
      .map(salon => salon.closeTime || '17:00')
      .reduce((a, b) => (a > b ? a : b), '00:00');

    const slots = shown.length ? generateTimeSlots(earliest, latest) : generateTimeSlots('09:00', '17:00');

    // ako postoji termin van radnog vremena (stari podaci), ipak ga prikazi
    const extra = visible.map(appointment => appointment.timeSlot).filter(time => !slots.includes(time));
    this.rows = [...new Set([...slots, ...extra])].sort();
  }
}