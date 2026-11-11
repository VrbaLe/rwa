import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StatisticsState } from './statistics.reducer';

export const selectStatisticsState = createFeatureSelector<StatisticsState>('statistics');

export const selectStatistics = createSelector(selectStatisticsState, (state) => state.stats);
export const selectStatisticsLoading = createSelector(selectStatisticsState, (state) => state.loading);
export const selectStatisticsError = createSelector(selectStatisticsState, (state) => state.error);