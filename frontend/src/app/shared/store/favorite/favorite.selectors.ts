import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoriteState } from './favorite.reducer';

export const selectFavoriteState = createFeatureSelector<FavoriteState>('favorite');

export const selectFavoriteIds = createSelector(selectFavoriteState, (state) => state.salonIds);
export const selectFavoritesLoaded = createSelector(selectFavoriteState, (state) => state.favoritesLoaded);
export const selectFavoritesError = createSelector(selectFavoriteState, (state) => state.error);
export const selectFavoritesCount = createSelector(selectFavoriteIds, (ids) => ids.length);

export const selectIsFavorite = (salonId: number) =>
  createSelector(selectFavoriteIds, (ids) => ids.includes(salonId));