import { createAction, props } from "@ngrx/store";

//SVI OMILJENI
export const loadFavorites = createAction(
    '[Favorite] Load Favorites'
);
export const loadFavoritesSuccess = createAction(
    '[Favorite] Load Favorites Success',
    props<{salon_ids: number[]}>()
);
export const loadFavoritesFailure = createAction(
    '[Favorite] Load Favorites Failure',
    props<{error: string}>()
);

//DODAJ U OMILJENE
export const addFavorite = createAction(
    '[Favorite] Add Favorite',
    props<{salon_id: number}>()
);
export const addFavoriteSuccess = createAction(
    '[Favorite] Add Favorite Success',
    props<{salon_id: number}>()
);
export const addFavoriteFailure = createAction(
    '[Favorite] Add Favorite Failure',
    props<{error: string}>()
);

//UKLONI IZ OMILJENIH
export const removeFavorite = createAction(
    '[Favorite] Remove Favorite',
    props<{salon_id: number}>()
);
export const removeFavoriteSuccess = createAction(
    '[Favorite] Remove Favorite Success',
    props<{salon_id: number}>()
);
export const removeFavoriteFailure = createAction(
    '[Favorite] Remove Favorite Failure',
    props<{error: string}>()
);