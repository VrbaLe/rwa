import { createSelector } from '@ngrx/store';
import { selectSalonViews } from '../salon/salon.selectors';

export const selectFavoriteSalons = createSelector(selectSalonViews, (salons) =>
  salons.filter((salon) => salon.isFavorite),
);