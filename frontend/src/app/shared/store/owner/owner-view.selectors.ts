import { createSelector } from '@ngrx/store';
import { selectAllOwners } from './owner.selectors';
import { selectSalonViews } from '../salon/salon.selectors';
import { OwnerViewDto } from '../../dtos/owner-view.dto';

export const selectOwnerViews = createSelector(
  selectAllOwners,
  selectSalonViews,
  (owners, salons): OwnerViewDto[] =>
    owners.map((owner) => ({
      ...owner,
      salons: salons.filter((salon) => salon.ownerId === owner.id),
    })),
);

export const selectOwnerViewById = (id: number) =>
  createSelector(selectOwnerViews, (owners) => owners.find((owner) => owner.id === id) ?? null);