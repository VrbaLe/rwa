import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { SalonInfoDto } from '../../dtos/salon-info.dto';
import { SalonStoreDto } from '../../dtos/salon-store.dto';
import { SalonFilterDto } from '../../dtos/salon-filter.dto';
import {
    addReviewFailure,
    addReviewSuccess,
    deleteReviewFailure,
    deleteReviewSuccess,
    addSalon,
    addSalonFailure,
    addSalonSuccess,
    deleteSalonFailure,
    deleteSalonSuccess,
    loadSalon,
    loadSalonFailure,
    loadSalonSuccess,
    loadSalons,
    loadSalonsFailure,
    loadSalonsSuccess,
    resetFilters,
    setFilters,
    updateSalon,
    updateSalonSuccess,
    updateSalonFailure,
    addTreatment,
    addTreatmentSuccess,
    addTreatmentFailure,
    deleteTreatment,
    deleteTreatmentFailure,
    deleteTreatmentSuccess
} from './salon.actions';

export interface SalonState extends EntityState<SalonStoreDto> {
    salonsLoaded: boolean;

    selectedSalonId: number | null;

    filters: SalonFilterDto;

    newSalonAdded: boolean;

    loading: boolean;
    error: string | null;
}

export const salonAdapter = createEntityAdapter<SalonStoreDto>();

export const initialFilters: SalonFilterDto = {
    city: '',
    category: '',
    search: '',
    minRating: 0,
    sortBy: 'rating',
    order: 'DESC'
};

export const initialState: SalonState = salonAdapter.getInitialState({
    salonsLoaded: false,

    selectedSalonId: null,

    filters: initialFilters,

    newSalonAdded: false,

    loading: false,
    error: null
});

const toStoreDto = ({ owner, reviews, avgRating, reviewCount, ...rest }: SalonInfoDto): SalonStoreDto => ({
    ...rest,
    reviews: reviews ?? [],
    ownerId: owner.id
});

export const salonReducer = createReducer(
    initialState,

    // SVI SALONI
    on(loadSalons, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadSalonsSuccess, (state, { salons }) =>
        salonAdapter.setAll(salons.map(toStoreDto), {
            ...state,
            salonsLoaded: true,
            loading: false
        })
    ),
    on(loadSalonsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),

    // JEDAN SALON
    on(loadSalon, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadSalonSuccess, (state, { salon }) =>
        salonAdapter.upsertOne(toStoreDto(salon), {
            ...state,
            selectedSalonId: salon.id,
            loading: false
        })
    ),
    on(loadSalonFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),

    // DODAJ SALON
    on(addSalon, (state) => ({
        ...state,
        newSalonAdded: false,
        loading: true,
        error: null
    })),
    on(addSalonSuccess, (state, { salon }) =>
        salonAdapter.upsertOne(toStoreDto(salon), {
            ...state,
            newSalonAdded: true,
            loading: false
        })
    ),
    on(addSalonFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),

    // OBRISI SALON
    on(deleteSalonSuccess, (state, { id }) =>
        salonAdapter.removeOne(id, {
            ...state,
            selectedSalonId: state.selectedSalonId === id ? null : state.selectedSalonId
        })
    ),
    on(deleteSalonFailure, (state, { error }) => ({
        ...state,
        error: error
    })),

    // FILTERI
    on(setFilters, (state, { filters }) => ({
        ...state,
        filters: { ...state.filters, ...filters }
    })),
    on(resetFilters, (state) => ({
        ...state,
        filters: initialFilters
    })),

    // DODAJ RECENZIJU
    on(addReviewSuccess, (state, { review, salon_id }) => {
        const salon = state.entities[salon_id];
        if (!salon) {
            return state;
        }
        return salonAdapter.updateOne(
            { id: salon_id, changes: { reviews: [...salon.reviews, review] } },
            state
        );
    }),
    on(addReviewFailure, (state, { error }) => ({
        ...state,
        error: error
    })),

        // OBRISI RECENZIJU
    on(deleteReviewSuccess, (state, { review_id, salon_id }) => {
        const salon = state.entities[salon_id];
        if (!salon) {
            return state;
        }
        return salonAdapter.updateOne(
            { id: salon_id, changes: { reviews: salon.reviews.filter(review => review.id !== review_id) } },
            state
        );
    }),
    on(deleteReviewFailure, (state, { error }) => ({
        ...state,
        error: error
    })),

    // IZMENI SALON
    on(updateSalon, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(updateSalonSuccess, (state, { salon }) =>
        salonAdapter.upsertOne(toStoreDto(salon), { ...state, loading: false })
    ),

    // GRESKE (izmena salona, usluge)
    on(updateSalonFailure, addTreatmentFailure, deleteTreatmentFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    }))
);