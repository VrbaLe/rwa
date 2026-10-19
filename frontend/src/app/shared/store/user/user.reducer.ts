import { createReducer, on } from '@ngrx/store';
import { UserSessionDto } from '../../dtos/user-session.dto';
import { UserDataStoreDto } from '../../dtos/user.dto';
import {
    clearUser,
    loadUserData,
    loadUserDataFailure,
    loadUserDataSuccess,
    setUser
} from './user.actions';

export interface UserState {
    current: UserSessionDto | null;

    user: UserDataStoreDto | null;
    userDataLoaded: boolean;

    error: string | null;
}

export const initialState: UserState = {
    current: null,

    user: null,
    userDataLoaded: false,

    error: null
};

export const userReducer = createReducer(
    initialState,

    on(setUser, (state, { user }) => ({
        ...state,
        current: user
    })),
    on(clearUser, () => initialState),

    on(loadUserData, (state) => ({
        ...state,
        error: null
    })),
    on(loadUserDataSuccess, (state, { user }) => ({
        ...state,
        user: user,
        userDataLoaded: true
    })),
    on(loadUserDataFailure, (state, { error }) => ({
        ...state,
        error: error
    }))
);