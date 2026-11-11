import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map, startWith, switchMap, take } from 'rxjs';
import { SalonViewDto } from '../../dtos/salon-view.dto';
import { loadAppointments } from '../../store/appointment/appointment.actions';
import { loadSalons } from '../../store/salon/salon.actions';
import { selectSalonsLoaded } from '../../store/salon/salon.selectors';
import { RevenueGroup, RevenueRow, selectRevenueRows } from '../../store/user/revenue.selectors';
import { selectMySalons } from '../../store/user/user-view.selectors';

const MONTHS = [
  'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
  'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
];

@Component({
  selector: 'app-owner-statistics',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, ReactiveFormsModule],
  templateUrl: './owner-statistics.component.html',
  styleUrl: './owner-statistics.component.scss'
})
export class OwnerStatisticsComponent implements OnInit {
  mySalons$: Observable<SalonViewDto[]> = this.store.select(selectMySalons);

  form = this.fb.nonNullable.group({
    salonId: ['all'],
    group: ['day' as RevenueGroup],
    onlyDone: [false]
  });

  // kad se promeni salon, period ili checkbox, izracunaj nove redove
  rows$: Observable<RevenueRow[]> = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
    switchMap(value =>
      this.store.select(selectRevenueRows(value.salonId ?? 'all', value.group ?? 'day', !!value.onlyDone))
    )
  );

  totals$ = this.rows$.pipe(
    map(rows =>
      rows.reduce(
        (total, row) => ({
          appointments: total.appointments + row.appointments,
          revenue: total.revenue + row.revenue
        }),
        { appointments: 0, revenue: 0 }
      )
    )
  );

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadAppointments());

    this.store.select(selectSalonsLoaded).pipe(take(1)).subscribe(loaded => {
      if (!loaded) {
        this.store.dispatch(loadSalons());
      }
    });
  }

  get group(): RevenueGroup {
    return this.form.controls.group.value;
  }

  setGroup(group: RevenueGroup): void {
    this.form.controls.group.setValue(group);
  }

  label(period: string): string {
    if (this.group === 'day') {
      return `${period.slice(8, 10)}.${period.slice(5, 7)}.${period.slice(0, 4)}`;
    }
    if (this.group === 'month') {
      return `${MONTHS[Number(period.slice(5, 7)) - 1]} ${period.slice(0, 4)}`;
    }
    return period;
  }
}