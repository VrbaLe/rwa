import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { OwnerDto } from '../../dtos/owner.dto';
import {
    loadOwner,
    loadOwnerFailure,
    loadOwnerSuccess,
    loadOwners,
    loadOwnersFailure,
    loadOwnersSuccess,
    updateOwner,
    updateOwnerFailure,
    updateOwnerSuccess,
    upsertOwners
} from './owner.actions';

export interface OwnerState extends EntityState<OwnerDto> {
    ownersLoaded: boolean;

    loading: boolean;
    error: string | null;
}

export const ownerAdapter = createEntityAdapter<OwnerDto>();

export const initialState: OwnerState = ownerAdapter.getInitialState({
    ownersLoaded: false,

    loading: false,
    error: null
});

// saloni se ne cuvaju u vlasniku, selektor ih sastavlja iz salon store-a
const toStoreDto = ({ salons, ...rest }: OwnerDto): OwnerDto => rest;

export const ownerReducer = createReducer(
    initialState,

    // VLASNICI IZ SALONA
    on(upsertOwners, (state, { owners }) =>
        ownerAdapter.upsertMany(owners.map(toStoreDto), state)
    ),

    // SVI VLASNICI
    on(loadOwners, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadOwnersSuccess, (state, { owners }) =>
        ownerAdapter.upsertMany(owners.map(toStoreDto), {
            ...state,
            ownersLoaded: true,
            loading: false
        })
    ),
    on(loadOwnersFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),

    // JEDAN VLASNIK
    on(loadOwner, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadOwnerSuccess, (state, { owner }) =>
        ownerAdapter.upsertOne(toStoreDto(owner), { ...state, loading: false })
    ),
    on(loadOwnerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),

    // IZMENI PROFIL
    on(updateOwner, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(updateOwnerSuccess, (state) => ({
        ...state,
        loading: false
    })),
    on(updateOwnerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    }))
);