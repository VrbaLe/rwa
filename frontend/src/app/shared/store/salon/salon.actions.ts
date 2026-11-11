import { createAction,props } from "@ngrx/store";
import { SalonInfoDto } from "../../dtos/salon-info.dto";
import { ReviewDto } from "../../dtos/review.dto";
import { CreateReviewDto } from "../../dtos/create-review.dto";
import { SalonFilterDto } from "../../dtos/salon-filter.dto";
import { CreateTreatmentDto } from "../../dtos/treatment.dto";
import { GeoPoint } from "../../dtos/geo-point.dto";

//SVI SALONI
export const loadSalons= createAction(
    '[Salon] Load Salons'
);
export const loadSalonsSuccess = createAction(
    '[Salon] Load Salons Success',
    props<{salons: SalonInfoDto[]}>()
);
export const loadSalonsFailure = createAction(
    '[Salon] Load Salons Failure',
    props<{error: string}>()
);

//JEDAN SALON
export const loadSalon = createAction(
    '[Salon] Load Salon',
    props<{id: number}>()
);
export const loadSalonSuccess = createAction(
    '[Salon] Load Salon Success',
    props<{salon: SalonInfoDto}>()
);
export const loadSalonFailure = createAction(
    '[Salon] Load Salon Failure',
    props<{error: string}>()
);

//DODAJ SALON
export const addSalon = createAction(
    '[Salon] Add Salon',
    props<{salonData: FormData}>()
);
export const addSalonSuccess = createAction(
    '[Salon] Add Salon Success',
    props<{salon: SalonInfoDto}>()
);
export const addSalonFailure = createAction(
    '[Salon] Add Salon Failure',
    props<{error: string}>()
);

//OBRISI SALON
export const deleteSalon = createAction(
    '[Salon] Delete Salon',
    props<{id: number}>()
);
export const deleteSalonSuccess = createAction(
    '[Salon] Delete Salon Success',
    props<{id: number}>()
);
export const deleteSalonFailure = createAction(
    '[Salon] Delete Salon Failure',
    props<{error: string}>()
);

//FILTERI
export const setFilters = createAction(
    '[Salon] Set Filters',
    props<{filters: Partial<SalonFilterDto>}>()
);
export const resetFilters = createAction(
    '[Salon] Reset Filters'
);

//DODAJ RECENZIJU
export const addReview = createAction(
    '[Salon] Add Review',
    props<{review: CreateReviewDto}>()
);
export const addReviewSuccess = createAction(
    '[Salon] Add Review Success',
    props<{review: ReviewDto, salon_id: number}>()
);
export const addReviewFailure = createAction(
    '[Salon] Add Review Failure',
    props<{error: string}>()
);

//OBRISI RECENZIJU
export const deleteReview = createAction(
    '[Salon] Delete Review',
    props<{review_id: number, salon_id: number}>()
);
export const deleteReviewSuccess = createAction(
    '[Salon] Delete Review Success',
    props<{review_id: number, salon_id: number}>()
);
export const deleteReviewFailure = createAction(
    '[Salon] Delete Review Failure',
    props<{error: string}>()
);

//IZMENI SALON
export const updateSalon = createAction(
    '[Salon] Update Salon',
    props<{id: number, salonData: FormData}>()
);
export const updateSalonSuccess = createAction(
    '[Salon] Update Salon Success',
    props<{salon: SalonInfoDto}>()
);
export const updateSalonFailure = createAction(
    '[Salon] Update Salon Failure',
    props<{error: string}>()
);

//DODAJ USLUGU
export const addTreatment = createAction(
    '[Salon] Add Treatment',
    props<{treatment: CreateTreatmentDto}>()
);
export const addTreatmentSuccess = createAction(
    '[Salon] Add Treatment Success',
    props<{salon_id: number}>()
);
export const addTreatmentFailure = createAction(
    '[Salon] Add Treatment Failure',
    props<{error: string}>()
);

//OBRISI USLUGU
export const deleteTreatment = createAction(
    '[Salon] Delete Treatment',
    props<{treatment_id: number, salon_id: number}>()
);
export const deleteTreatmentSuccess = createAction(
    '[Salon] Delete Treatment Success',
    props<{salon_id: number}>()
);
export const deleteTreatmentFailure = createAction(
    '[Salon] Delete Treatment Failure',
    props<{error: string}>()
);

//LOKACIJA KORISNIKA
export const locateUser = createAction(
    '[Salon] Locate User'
);
export const locateUserSuccess = createAction(
    '[Salon] Locate User Success',
    props<{location: GeoPoint}>()
);
export const locateUserFailure = createAction(
    '[Salon] Locate User Failure',
    props<{error: string}>()
);
export const clearUserLocation = createAction(
    '[Salon] Clear User Location'
);