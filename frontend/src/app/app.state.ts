import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from './shared/store/auth/auth.reducer';
import { UserState, userReducer } from './shared/store/user/user.reducer';
import { OwnerState, ownerReducer } from './shared/store/owner/owner.reducer';
import { SalonState, salonReducer } from './shared/store/salon/salon.reducer';
import { AppointmentState, appointmentReducer } from './shared/store/appointment/appointment.reducer';
import { FavoriteState, favoriteReducer } from './shared/store/favorite/favorite.reducer';
import { StatisticsState, statisticsReducer } from './shared/store/statistics/statistics.reducer';

export interface AppState {
  auth: AuthState;
  user: UserState;
  owner: OwnerState;
  salon: SalonState;
  appointment: AppointmentState;
  favorite: FavoriteState;
  statistics: StatisticsState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  user: userReducer,
  owner: ownerReducer,
  salon: salonReducer,
  appointment: appointmentReducer,
  favorite: favoriteReducer,
  statistics: statisticsReducer,
};