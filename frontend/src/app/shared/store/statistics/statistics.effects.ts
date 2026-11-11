import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, of } from "rxjs";
import { StatisticsService } from "../../services/statistics/statistics.service";
import { loadStatistics, loadStatisticsFailure, loadStatisticsSuccess } from "./statistics.actions";

@Injectable()
export class StatisticsEffects {
  loadStatistics = createEffect(() =>
    this.actions$.pipe(
      ofType(loadStatistics),
      switchMap(() =>
        this.statisticsService.loadOwnerStats().pipe(
          map(response => {
            if (response) {
              return loadStatisticsSuccess({ stats: response });
            } else {
              return loadStatisticsFailure({ error: "Statistika nije dostupna" });
            }
          }),
          catchError(error =>
            of(loadStatisticsFailure({ error: error.error?.message ?? "Greška pri učitavanju statistike" }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private statisticsService: StatisticsService
  ) {}
}