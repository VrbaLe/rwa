import { createAction,props } from "@ngrx/store";
import { SalonInfoDto } from "../../dtos/salon-info.dto";
import { ReviewDto } from "../../dtos/review.dto";
import { CreateReviewDto } from "../../dtos/create-review.dto";
import { SalonFilterDto } from "../../dtos/salon-filter.dto";

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