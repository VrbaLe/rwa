import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { AuthService } from "../../services/auth/auth.service";
import { loadTokenFailure, loadTokenSuccess, login, loginFailure, loginSuccess, logout, registerOwner, registerOwnerFailure, registerOwnerSuccess, registerUser, registerUserFailure, registerUserSuccess } from "./auth.actions";
import { catchError, filter, map, mergeMap, Observable, of, switchMap, tap, throwError } from "rxjs";
import { LocalstorageService } from "../../services/localstorage/localstorage.service";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { UserService } from "../../services/user/user.service";
import { loadUserData } from "../user/user.actions";


@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(action =>
        this.authService.login(action.username, action.password).pipe(
          map(response => {
            if(response){
              const { token } = response; 
              return loginSuccess({ token });
            }else{
              return loginFailure({error: "Pogrešna email adresa ili lozinka!"})
            }
          }),
          catchError(error => of(loginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      tap(action => {
        this.localStorageService.setItem('authToken', action.token);
        this.authService.setToken(action.token);
        this.router.navigate(['/client-dashboard/0']);
      }),
      switchMap(action => {
        const userId = this.authService.getUserFromToken(action.token).id;
        return of(loadUserData({ id: userId }));
      })
    )
  );

  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginFailure),
      tap(({ error }) => {
        console.log(error);
      })
    ), { dispatch: false }
  );

  loadToken$ = createEffect(() =>
    of(this.localStorageService.getItem('authToken')).pipe(
      filter(token => !!token),
      map(token => {
        if (this.authService.isValidToken(token!)) {
          return loadTokenSuccess({ token: token! });
        } else {
          return loadTokenFailure();
        }
      }),
    )
  );

  storeToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTokenSuccess),
      tap(action => {
        this.localStorageService.setItem('authToken', action.token);
      })
    )
  );

  removeToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTokenFailure),
      tap(() => {
        this.localStorageService.removeItem('authToken');
      })
    ), { dispatch: false }
  );

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      mergeMap(action =>
        this.authService.registerUser(action.email, action.password).pipe(
          map(response => {
            if(response){
              const { success, data, message } = response; 
              if(success)
                return registerUserSuccess({ status: success, data: data });
              else
                return registerUserFailure({status: success, message: message})
            }else{
              return registerUserFailure({status: false, message: "Došlo je do greške prilikom registracije!"})
            }
          }),
          catchError(error => of(registerUserFailure({status: false, message: "Došlo je do greške prilikom registracije!"})))
        )
      )
    )
  );

  
  registerOwner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerOwner),
      mergeMap(action =>
        this.authService.registerOwner(action.name, action.surname, action.email, action.password, action.instagram).pipe(
          map(response => {
            if(response){
              const { success, data, message } = response; 
              if(success)
                return registerOwnerSuccess({ status: success, data: data });
              else
                return registerOwnerFailure({status: success, message: message})
            }else{
              return registerOwnerFailure({status: false, message: "Došlo je do greške prilikom registracije"})
            }
          }),
          catchError(error => of(registerOwnerFailure({status: false, message: "Došlo je do greške prilikom registracije"})))
        )
      )
    )
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerOwnerSuccess),
      tap(action => {
        this.router.navigate(['/dashboard']);
      })
    ), { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        this.localStorageService.removeItem('authToken');
        this.router.navigate(['/']);
      })
    ), { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private userService: UserService,
    private localStorageService: LocalstorageService,
    private router: Router,
    private store: Store
  ) {}
}