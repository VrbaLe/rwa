import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { AuthService } from "../services/auth/auth.service";
import { catchError, map, Observable, of, switchMap, take } from "rxjs";
import { selectToken } from "../store/auth/auth.selectors";

@Injectable({
    providedIn: 'root'
})
export class OwnerGuard implements CanActivate {
    constructor(
        private store: Store,
        private authService: AuthService,
        private router: Router
    ){}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.store.pipe(
            select(selectToken),
            take(1),
            switchMap(token => {
                if (token && this.authService.isValidToken(token)) {
                    const tokenData = this.authService.getUserFromToken(token);
                    if (tokenData.role && tokenData.role === 'owner') {
                        return of(true);
                    } else {
                        this.router.navigate(['/']);
                        return of(false);
                    }
                } else {
                    this.router.navigate(['/']);
                    return of(false);
                }
            })
        );
    }
}