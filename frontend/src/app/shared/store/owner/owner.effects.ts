import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { environment } from "../../../../environments/environment";
import { OwnerService } from "../../services/owner/owner.service";
import { OwnerDto } from "../../dtos/owner.dto";
import { addSalonSuccess, loadSalonSuccess, loadSalonsSuccess } from "../salon/salon.actions";
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
} from "./owner.actions";

@Injectable()
export class OwnerEffects {
  ownersFromSalons = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSalonsSuccess),
      map(action =>
        upsertOwners({ owners: action.salons.map(salon => salon.owner).filter(owner => !!owner) })
      )
    )
  );

  ownerFromSalon = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSalonSuccess, addSalonSuccess),
      map(action => upsertOwners({ owners: [action.salon.owner] }))
    )
  );

  loadOwners = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOwners),
      mergeMap(() =>
        this.ownerService.loadOwners().pipe(
          map(response => {
            if (Array.isArray(response)) {
              return loadOwnersSuccess({ owners: response.map(element => this.mapOwner(element)) });
            } else {
              return loadOwnersFailure({ error: "Greška pri učitavanju vlasnika" });
            }
          }),
          catchError(error =>
            of(loadOwnersFailure({ error: error.error?.message ?? "Greška pri učitavanju vlasnika" }))
          )
        )
      )
    )
  );

  loadOwner = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOwner),
      mergeMap(action =>
        this.ownerService.selectOwner(action.id).pipe(
          map(response => {
            if (response) {
              return loadOwnerSuccess({ owner: this.mapOwner(response) });
            } else {
              return loadOwnerFailure({ error: "Vlasnik nije pronađen" });
            }
          }),
          catchError(error =>
            of(loadOwnerFailure({ error: error.error?.message ?? "Vlasnik nije pronađen" }))
          )
        )
      )
    )
  );

  updateOwner = createEffect(() =>
    this.actions$.pipe(
      ofType(updateOwner),
      switchMap(action =>
        this.ownerService.updateOwner(action.id, action.ownerData).pipe(
          switchMap(() =>
            of(
              updateOwnerSuccess({ id: action.id }),
              loadOwner({ id: action.id })
            )
          ),
          catchError(error =>
            of(updateOwnerFailure({ error: error.error?.message ?? "Greška pri izmeni profila" }))
          )
        )
      )
    )
  );

  private mapOwner(owner: OwnerDto): OwnerDto {
    return {
      ...owner,
      picture: owner.picture
        ? `${environment.apiUrl}/${owner.picture.replace(/\\/g, "/")}`
        : undefined
    };
  }

  constructor(
    private actions$: Actions,
    private ownerService: OwnerService
  ) {}
}