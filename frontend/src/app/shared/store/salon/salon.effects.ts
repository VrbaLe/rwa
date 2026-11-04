import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import { environment } from "../../../../environments/environment";
import { SalonService } from "../../services/salon/salon.service";
import { ReviewService } from "../../services/review/review.service";
import { TreatmentService } from "../../services/treatment/treatment.service";
import { SalonInfoDto } from "../../dtos/salon-info.dto";
import {
  addReview,
  addReviewFailure,
  addReviewSuccess,
  deleteReview,
  deleteReviewFailure,
  deleteReviewSuccess,
  addSalon,
  addSalonFailure,
  addSalonSuccess,
  deleteSalon,
  deleteSalonFailure,
  deleteSalonSuccess,
  loadSalon,
  loadSalonFailure,
  loadSalonSuccess,
  loadSalons,
  loadSalonsFailure,
  loadSalonsSuccess,
  updateSalon,
  updateSalonFailure,
  updateSalonSuccess,
  addTreatment,
  addTreatmentFailure,
  addTreatmentSuccess,
  deleteTreatment,
  deleteTreatmentFailure,
  deleteTreatmentSuccess,
} from "./salon.actions";

@Injectable()
export class SalonEffects {
  loadSalons = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSalons),
      mergeMap(() =>
        this.salonService.loadSalons({ skip: 0, limit: 100 }).pipe(
          map(response => {
            if (response) {
              const mappedSalons = response.map(element => this.mapSalon(element));
              return loadSalonsSuccess({ salons: mappedSalons });
            } else {
              return loadSalonsFailure({ error: "Greška pri učitavanju salona" });
            }
          }),
          catchError(error =>
            of(loadSalonsFailure({ error: error.error?.message ?? "Greška pri učitavanju salona" }))
          )
        )
      )
    )
  );

  loadSalon = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSalon),
      mergeMap(action =>
        this.salonService.selectSalon(action.id).pipe(
          map(response => {
            if (response) {
              return loadSalonSuccess({ salon: this.mapSalon(response) });
            } else {
              return loadSalonFailure({ error: "Salon nije pronađen" });
            }
          }),
          catchError(error =>
            of(loadSalonFailure({ error: error.error?.message ?? "Salon nije pronađen" }))
          )
        )
      )
    )
  );

  addSalon = createEffect(() =>
    this.actions$.pipe(
      ofType(addSalon),
      mergeMap(action =>
        this.salonService.addNewSalon(action.salonData).pipe(
          map(response => {
            if (response) {
              return addSalonSuccess({ salon: this.mapSalon(response) });
            } else {
              return addSalonFailure({ error: "Salon nije sačuvan" });
            }
          }),
          catchError(error =>
            of(addSalonFailure({ error: error.error?.message ?? "Greška pri kreiranju salona" }))
          )
        )
      )
    )
  );

  addSalonSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addSalonSuccess),
        tap(() => this.router.navigate(["/"]))
      ),
    { dispatch: false }
  );

  deleteSalon = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSalon),
      mergeMap(action =>
        this.salonService.deleteSalon(action.id).pipe(
          map(() => deleteSalonSuccess({ id: action.id })),
          catchError(error =>
            of(deleteSalonFailure({ error: error.error?.message ?? "Greška pri brisanju salona" }))
          )
        )
      )
    )
  );

  addReview = createEffect(() =>
    this.actions$.pipe(
      ofType(addReview),
      mergeMap(action =>
        this.reviewService.create(action.review).pipe(
          map(response => {
            if (response) {
              return addReviewSuccess({
                review: {
                  id: response.id,
                  rate: response.rate,
                  comment: response.comment,
                  created_at: response.created_at,
                  user: response.user ? { id: response.user.id } : undefined
                },
                salon_id: action.review.salon_id
              });
            } else {
              return addReviewFailure({ error: "Recenzija nije sačuvana" });
            }
          }),
          catchError(error =>
            of(addReviewFailure({ error: error.error?.message ?? "Greška pri slanju recenzije" }))
          )
        )
      )
    )
  );

    deleteReview = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteReview),
      mergeMap(action =>
        this.reviewService.deleteReview(action.review_id).pipe(
          map(() => deleteReviewSuccess({ review_id: action.review_id, salon_id: action.salon_id })),
          catchError(error =>
            of(deleteReviewFailure({ error: error.error?.message ?? "Greška pri brisanju recenzije" }))
          )
        )
      )
    )
  );

  private mapSalon(salon: SalonInfoDto): SalonInfoDto {
    return {
      ...salon,
      image: this.toUrl(salon.image),
      owner: {
        ...salon.owner,
        picture: salon.owner.picture ? this.toUrl(salon.owner.picture) : undefined
      }
    };
  }

  private toUrl(path: string): string {
    return `${environment.apiUrl}/${path.replace(/\\/g, "/")}`;
  }

  updateSalon = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSalon),
      mergeMap(action =>
        this.salonService.updateSalon(action.id, action.salonData).pipe(
          map(response => {
            if (response) {
              return updateSalonSuccess({ salon: this.mapSalon(response) });
            } else {
              return updateSalonFailure({ error: "Salon nije sačuvan" });
            }
          }),
          catchError(error =>
            of(updateSalonFailure({ error: error.error?.message ?? "Greška pri izmeni salona" }))
          )
        )
      )
    )
  );

  updateSalonSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateSalonSuccess),
        tap(() => this.router.navigate(["/profile"]))
      ),
    { dispatch: false }
  );

  addTreatment = createEffect(() =>
    this.actions$.pipe(
      ofType(addTreatment),
      mergeMap(action =>
        this.treatmentService.create(action.treatment).pipe(
          map(() => addTreatmentSuccess({ salon_id: action.treatment.salon_id })),
          catchError(error =>
            of(addTreatmentFailure({ error: error.error?.message ?? "Greška pri dodavanju usluge" }))
          )
        )
      )
    )
  );

  deleteTreatment = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTreatment),
      mergeMap(action =>
        this.treatmentService.remove(action.treatment_id).pipe(
          map(() => deleteTreatmentSuccess({ salon_id: action.salon_id })),
          catchError(error =>
            of(deleteTreatmentFailure({ error: error.error?.message ?? "Greška pri brisanju usluge" }))
          )
        )
      )
    )
  );

  reloadSalonAfterTreatment = createEffect(() =>
    this.actions$.pipe(
      ofType(addTreatmentSuccess, deleteTreatmentSuccess),
      map(action => loadSalon({ id: action.salon_id }))
    )
  );

  constructor(
    private actions$: Actions,
    private salonService: SalonService,
    private reviewService: ReviewService,
    private treatmentService: TreatmentService,
    private router: Router
  ) {}
}