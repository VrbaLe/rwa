import { createAction, props } from "@ngrx/store";
import { OwnerStatsDto } from "../../dtos/owner-stats.dto";

//STATISTIKA VLASNIKA
export const loadStatistics = createAction(
    '[Statistics] Load Statistics'
);
export const loadStatisticsSuccess = createAction(
    '[Statistics] Load Statistics Success',
    props<{stats: OwnerStatsDto}>()
);
export const loadStatisticsFailure = createAction(
    '[Statistics] Load Statistics Failure',
    props<{error: string}>()
);