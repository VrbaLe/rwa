import { createReducer, on } from '@ngrx/store';
import { OwnerStatsDto } from '../../dtos/owner-stats.dto';
import { clearUser } from '../user/user.actions';
import { loadStatistics, loadStatisticsFailure, loadStatisticsSuccess } from './statistics.actions';

export interface StatisticsState {
    stats: OwnerStatsDto | null;
    loading: boolean;
    error: string | null;
}

export const initialState: StatisticsState = {
    stats: null,
    loading: false,
    error: null
};

export const statisticsReducer = createReducer(
    initialState,
    on(loadStatistics, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadStatisticsSuccess, (state, { stats }) => ({
        ...state,
        stats: stats,
        loading: false
    })),
    on(loadStatisticsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),
    on(clearUser, () => initialState)
);