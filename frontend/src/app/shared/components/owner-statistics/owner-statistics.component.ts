import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { BarChartComponent, BarItem } from '../bar-chart/bar-chart.component';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { OwnerStatsDto } from '../../dtos/owner-stats.dto';
import { loadStatistics } from '../../store/statistics/statistics.actions';
import {
  selectStatistics,
  selectStatisticsError,
  selectStatisticsLoading
} from '../../store/statistics/statistics.selectors';

type ChartMode = 'daily' | 'monthly';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];

@Component({
  selector: 'app-owner-statistics',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, StatCardComponent, BarChartComponent],
  templateUrl: './owner-statistics.component.html',
  styleUrl: './owner-statistics.component.scss'
})
export class OwnerStatisticsComponent implements OnInit {
  mode: ChartMode = 'daily';
  private mode$ = new BehaviorSubject<ChartMode>('daily');

  stats$: Observable<OwnerStatsDto | null> = this.store.select(selectStatistics);
  loading$: Observable<boolean> = this.store.select(selectStatisticsLoading);
  error$: Observable<string | null> = this.store.select(selectStatisticsError);

  // grafikon se racuna iz statistike i izabranog prikaza (dan / mesec)
  chart$: Observable<BarItem[]> = combineLatest([this.stats$, this.mode$]).pipe(
    map(([stats, mode]) => {
      if (!stats) {
        return [];
      }
      return mode === 'daily'
        ? stats.daily.map(day => ({
            label: `${day.date.slice(8, 10)}.${day.date.slice(5, 7)}.`,
            value: day.revenue
          }))
        : stats.monthly.map(month => ({
            label: `${MONTHS[Number(month.month.slice(5, 7)) - 1]} ${month.month.slice(2, 4)}`,
            value: month.revenue
          }));
    })
  );

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadStatistics());
  }

  setMode(mode: ChartMode): void {
    this.mode = mode;
    this.mode$.next(mode);
  }
}