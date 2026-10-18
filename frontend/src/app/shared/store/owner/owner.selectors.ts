import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OwnerState, ownerAdapter } from './owner.reducer';

export const selectOwnerState = createFeatureSelector<OwnerState>('owner');

const { selectAll, selectEntities } = ownerAdapter.getSelectors();

export const selectAllOwners = createSelector(selectOwnerState, selectAll);
export const selectOwnerEntities = createSelector(selectOwnerState, selectEntities);
export const selectOwnersLoaded = createSelector(selectOwnerState, (state) => state.ownersLoaded);
export const selectOwnerLoading = createSelector(selectOwnerState, (state) => state.loading);
export const selectOwnerError = createSelector(selectOwnerState, (state) => state.error);

export const selectOwnerById = (id: number) =>
  createSelector(selectOwnerEntities, (owners) => owners[id] ?? null);

export const selectOwnerFullName = (id: number) =>
  createSelector(selectOwnerById(id), (owner) =>
    owner ? `${owner.firstName} ${owner.lastName}` : '',
  );