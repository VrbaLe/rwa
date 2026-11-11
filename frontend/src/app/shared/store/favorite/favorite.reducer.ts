import { createReducer, on } from '@ngrx/store';
import { clearUser } from '../user/user.actions';
import {
    addFavoriteFailure,
    addFavoriteSuccess,
    loadFavoritesFailure,
    loadFavoritesSuccess,
    removeFavoriteFailure,
    removeFavoriteSuccess
} from './favorite.actions';

export interface FavoriteState {
    salonIds: number[];
    favoritesLoaded: boolean;
    error: string | null;
}

export const initialState: FavoriteState = {
    salonIds: [],
    favoritesLoaded: false,
    error: null
};

export const favoriteReducer = createReducer(
    initialState,

    on(loadFavoritesSuccess, (state, { salon_ids }) => ({
        ...state,
        salonIds: salon_ids,
        favoritesLoaded: true,
        error: null
    })),

    on(addFavoriteSuccess, (state, { salon_id }) => ({
        ...state,
        salonIds: state.salonIds.includes(salon_id) ? state.salonIds : [...state.salonIds, salon_id]
    })),

    on(removeFavoriteSuccess, (state, { salon_id }) => ({
        ...state,
        salonIds: state.salonIds.filter(id => id !== salon_id)
    })),

    on(loadFavoritesFailure, addFavoriteFailure, removeFavoriteFailure, (state, { error }) => ({
        ...state,
        error: error
    })),

    // odjava brise omiljene iz store-a
    on(clearUser, () => initialState)
);