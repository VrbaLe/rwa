import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { FavoriteService } from "../../services/favorite/favorite.service";
import { setUser } from "../user/user.actions";
import {
  addFavorite,
  addFavoriteFailure,
  addFavoriteSuccess,
  loadFavorites,
  loadFavoritesFailure,
  loadFavoritesSuccess,
  removeFavorite,
  removeFavoriteFailure,
  removeFavoriteSuccess
} from "./favorite.actions";

@Injectable()
export class FavoriteEffects {
  loadAfterLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(setUser),
      map(() => loadFavorites())
    )
  );

  loadFavorites = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFavorites),
      mergeMap(() =>
        this.favoriteService.loadFavorites().pipe(
          map(response => {
            if (Array.isArray(response)) {
              return loadFavoritesSuccess({ salon_ids: response });
            } else {
              return loadFavoritesFailure({ error: "Greška pri učitavanju omiljenih salona" });
            }
          }),
          catchError(error =>
            of(loadFavoritesFailure({ error: error.error?.message ?? "Greška pri učitavanju omiljenih salona" }))
          )
        )
      )
    )
  );

  addFavorite = createEffect(() =>
    this.actions$.pipe(
      ofType(addFavorite),
      mergeMap(action =>
        this.favoriteService.addFavorite(action.salon_id).pipe(
          map(() => addFavoriteSuccess({ salon_id: action.salon_id })),
          catchError(error =>
            of(addFavoriteFailure({ error: error.error?.message ?? "Salon nije dodat u omiljene" }))
          )
        )
      )
    )
  );

  removeFavorite = createEffect(() =>
    this.actions$.pipe(
      ofType(removeFavorite),
      mergeMap(action =>
        this.favoriteService.removeFavorite(action.salon_id).pipe(
          map(() => removeFavoriteSuccess({ salon_id: action.salon_id })),
          catchError(error =>
            of(removeFavoriteFailure({ error: error.error?.message ?? "Salon nije uklonjen iz omiljenih" }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private favoriteService: FavoriteService
  ) {}
}