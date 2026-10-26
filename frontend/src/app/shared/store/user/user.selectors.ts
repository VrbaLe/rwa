import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(selectUserState, (state) => state.current);
export const selectUserId = createSelector(selectCurrentUser, (user) => user?.id ?? null);
export const selectUserEmail = createSelector(selectCurrentUser, (user) => user?.email ?? null);
export const selectUserRole = createSelector(selectCurrentUser, (user) => user?.role ?? null);
export const selectIsOwner = createSelector(selectUserRole, (role) => role === 'owner');

export const selectUserData = createSelector(selectUserState, (state) => state.user);
export const selectUserDataLoaded = createSelector(selectUserState, (state) => state.userDataLoaded);
export const selectUserError = createSelector(selectUserState, (state) => state.error);
export const selectCurrentOwnerId = createSelector(selectUserData, (user) => user?.owner?.id ?? null);
export const selectIsLoggedIn = createSelector(selectCurrentUser, (user) => user !== null);