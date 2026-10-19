import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { appReducers } from './app.state';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { AuthEffects } from './shared/store/auth/auth.effects';
import { UserEffects } from './shared/store/user/user.effects';
import { OwnerEffects } from './shared/store/owner/owner.effects';
import { SalonEffects } from './shared/store/salon/salon.effects';
import { AppointmentEffects } from './shared/store/appointment/appointment.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideStore(appReducers),
    provideEffects([AuthEffects, UserEffects, OwnerEffects, SalonEffects, AppointmentEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};