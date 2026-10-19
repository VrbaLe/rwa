import { Injectable } from "@angular/core";
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from "@ngrx/effects";
import { catchError, filter, map, mergeMap, of } from "rxjs";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import { OwnerDto } from "../../dtos/owner.dto";
import { UserDataStoreDto } from "../../dtos/user.dto";
import { UserSessionDto } from "../../dtos/user-session.dto";
import { loginSuccess, logout } from "../auth/auth.actions";
import { upsertOwners } from "../owner/owner.actions";
import {
  clearUser,
  loadUserData,
  loadUserDataFailure,
  loadUserDataSuccess,
  setUser
} from "./user.actions";

@Injectable()
export class UserEffects {
  restoreUser = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => this.toSession(this.authService.getToken())),
      filter((user): user is UserSessionDto => user !== null),
      map(user => setUser({ user }))
    )
  );

  setUserOnLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      map(action => this.toSession(action.token)),
      filter((user): user is UserSessionDto => user !== null),
      map(user => setUser({ user }))
    )
  );

  loadDataAfterSetUser = createEffect(() =>
    this.actions$.pipe(
      ofType(setUser),
      map(action => loadUserData({ id: action.user.id }))
    )
  );

  loadUserData = createEffect(() =>
  this.actions$.pipe(
    ofType(loadUserData),
    mergeMap(action =>
      this.userService.loadData(action.id).pipe(
        mergeMap(response => {
          if (response) {
            const owner = response.owner ? this.mapOwner(response.owner) : null;
            const user: UserDataStoreDto = {
              id: response.id,
              email: response.email,
              created_at: response.created_at,
              owner: owner,
              reviews: response.reviews ? response.reviews.map(review => review.id) : [],
              appointments: response.appointments
                ? response.appointments.map(appointment => appointment.id)
                : []
            };
            if (owner) {
              return of(
                upsertOwners({ owners: [owner] }),
                loadUserDataSuccess({ user })
              );
            }
            return of(loadUserDataSuccess({ user }));
          } else {
            return of(loadUserDataFailure({ error: "Greška pri učitavanju korisnika" }));
          }
        }),
        catchError(error =>
          of(loadUserDataFailure({ error: error.error?.message ?? "Greška pri učitavanju korisnika" }))
        )
      )
    )
  )
);

  clearUserOnLogout = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      map(() => clearUser())
    )
  );

  private toSession(token: string | null): UserSessionDto | null {
    if (!token || !this.authService.isValidToken(token)) {
      return null;
    }
    const data = this.authService.getUserFromToken(token);
    if (!data || data.id === undefined || !data.role) {
      return null;
    }
    return { id: data.id, role: data.role, email: data.email };
  }

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
    private authService: AuthService,
    private userService: UserService
  ) {}
}