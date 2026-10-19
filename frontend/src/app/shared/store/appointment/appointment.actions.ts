import { createAction, props } from "@ngrx/store";
import { AppointmentDto } from "../../dtos/appointment.dto";
import { CreateAppointmentDto } from "../../dtos/create-appointment.dto";

//SVI TERMINI
export const loadAppointments = createAction(
    '[Appointment] Load Appointments'
);
export const loadAppointmentsSuccess = createAction(
    '[Appointment] Load Appointments Success',
    props<{appointments: AppointmentDto[]}>()
);
export const loadAppointmentsFailure = createAction(
    '[Appointment] Load Appointments Failure',
    props<{error: string}>()
);

//ZAKAZI TERMIN
export const createAppointment = createAction(
    '[Appointment] Create Appointment',
    props<{appointment: CreateAppointmentDto}>()
);
export const createAppointmentSuccess = createAction(
    '[Appointment] Create Appointment Success',
    props<{appointment: AppointmentDto, salon_id: number, client_id: number}>()
);
export const createAppointmentFailure = createAction(
    '[Appointment] Create Appointment Failure',
    props<{error: string}>()
);

//OTKAZI TERMIN
export const deleteAppointment = createAction(
    '[Appointment] Delete Appointment',
    props<{id: number}>()
);
export const deleteAppointmentSuccess = createAction(
    '[Appointment] Delete Appointment Success',
    props<{id: number}>()
);
export const deleteAppointmentFailure = createAction(
    '[Appointment] Delete Appointment Failure',
    props<{error: string}>()
);