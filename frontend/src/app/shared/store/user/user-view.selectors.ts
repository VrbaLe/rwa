import { createSelector } from '@ngrx/store';
import { selectCurrentOwnerId } from './user.selectors';
import { selectOwnerEntities } from '../owner/owner.selectors';
import { selectSalonViews } from '../salon/salon.selectors';

// VLASNIK KOJI JE PRIJAVLJEN
export const selectCurrentOwner = createSelector(
  selectCurrentOwnerId,
  selectOwnerEntities,
  (ownerId, owners) => (ownerId !== null ? owners[ownerId] ?? null : null),
);

// MOJI SALONI
export const selectMySalons = createSelector(
  selectSalonViews,
  selectCurrentOwnerId,
  (salons, ownerId) =>
    ownerId === null ? [] : salons.filter((salon) => salon.ownerId === ownerId),
);