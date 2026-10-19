import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppointmentState, appointmentAdapter } from './appointment.reducer';
import { selectSalonEntities } from '../salon/salon.selectors';
import { selectUserId } from '../user/user.selectors';
import { AppointmentViewDto } from '../../dtos/appointment-view.dto';

export const selectAppointmentState = createFeatureSelector<AppointmentState>('appointment');

const { selectAll } = appointmentAdapter.getSelectors();

export const selectAllAppointments = createSelector(selectAppointmentState, selectAll);
export const selectAppointmentsLoaded = createSelector(selectAppointmentState, (state) => state.appointmentsLoaded);
export const selectAppointmentAdded = createSelector(selectAppointmentState, (state) => state.appointmentAdded);
export const selectAppointmentsLoading = createSelector(selectAppointmentState, (state) => state.loading);
export const selectAppointmentsError = createSelector(selectAppointmentState, (state) => state.error);

// TERMIN + NAZIV SALONA
export const selectAppointmentViews = createSelector(
  selectAllAppointments,
  selectSalonEntities,
  (appointments, salons): AppointmentViewDto[] =>
    appointments
      .map((appointment) => ({
        ...appointment,
        salonName: appointment.salonId !== null ? (salons[appointment.salonId]?.name ?? '') : '',
      }))
      .sort((a, b) =>
        (a.appointmentDate + a.timeSlot).localeCompare(b.appointmentDate + b.timeSlot),
      ),
);

// MOJI TERMINI
export const selectMyAppointments = createSelector(
  selectAppointmentViews,
  selectUserId,
  (appointments, userId) =>
    appointments.filter((appointment) => userId !== null && appointment.clientId === userId),
);

// TERMINI JEDNOG SALONA
export const selectAppointmentsBySalon = (salonId: number) =>
  createSelector(selectAppointmentViews, (appointments) =>
    appointments.filter((appointment) => appointment.salonId === salonId),
  );

// ZAUZETI TERMINI JEDNOG SALONA ZA JEDAN DATUM
export const selectBookedSlots = (salonId: number, date: string) =>
  createSelector(selectAppointmentsBySalon(salonId), (appointments) =>
    appointments
      .filter((appointment) => appointment.appointmentDate === date)
      .map((appointment) => appointment.timeSlot),
  );