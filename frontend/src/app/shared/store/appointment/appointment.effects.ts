import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { AppointmentService } from "../../services/appointment/appointment.service";
import {
  createAppointment,
  createAppointmentFailure,
  createAppointmentSuccess,
  deleteAppointment,
  deleteAppointmentFailure,
  deleteAppointmentSuccess,
  loadAppointments,
  loadAppointmentsFailure,
  loadAppointmentsSuccess
} from "./appointment.actions";

@Injectable()
export class AppointmentEffects {
  loadAppointments = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAppointments),
      mergeMap(() =>
        this.appointmentService.loadAppointments().pipe(
          map(response => {
            if (Array.isArray(response)) {
              return loadAppointmentsSuccess({ appointments: response });
            } else {
              return loadAppointmentsFailure({ error: "Greška pri učitavanju termina" });
            }
          }),
          catchError(error =>
            of(loadAppointmentsFailure({ error: error.error?.message ?? "Greška pri učitavanju termina" }))
          )
        )
      )
    )
  );

  createAppointment = createEffect(() =>
    this.actions$.pipe(
      ofType(createAppointment),
      mergeMap(action =>
        this.appointmentService.createAppointment(action.appointment).pipe(
          map(response => {
            if (response) {
              return createAppointmentSuccess({
                appointment: response,
                salon_id: action.appointment.salon_id,
                client_id: action.appointment.client_id
              });
            } else {
              return createAppointmentFailure({ error: "Termin nije zakazan" });
            }
          }),
          catchError(error =>
            of(createAppointmentFailure({ error: error.error?.message ?? "Termin nije zakazan" }))
          )
        )
      )
    )
  );

  deleteAppointment = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteAppointment),
      mergeMap(action =>
        this.appointmentService.deleteAppointment(action.id).pipe(
          map(() => deleteAppointmentSuccess({ id: action.id })),
          catchError(error =>
            of(deleteAppointmentFailure({ error: error.error?.message ?? "Termin nije otkazan" }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private appointmentService: AppointmentService
  ) {}
}