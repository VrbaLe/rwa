import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectToken = createSelector(
    selectAuthState,
    (state: AuthState) => state.token
)

export const selectAuthError = createSelector(
    selectAuthState,
    (authState) => authState.error
);

export const selectAuthSuccess = createSelector(
    selectAuthState,
    (authState) => authState.user
);