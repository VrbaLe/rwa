import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { AppointmentDto } from '../../dtos/appointment.dto';
import { AppointmentStoreDto } from '../../dtos/appointment-store.dto';
import {
    createAppointment,
    createAppointmentFailure,
    createAppointmentSuccess,
    deleteAppointmentFailure,
    deleteAppointmentSuccess,
    loadAppointments,
    loadAppointmentsFailure,
    loadAppointmentsSuccess
} from './appointment.actions';

export interface AppointmentState extends EntityState<AppointmentStoreDto> {
    appointmentsLoaded: boolean;

    appointmentAdded: boolean;

    loading: boolean;
    error: string | null;
}

export const appointmentAdapter = createEntityAdapter<AppointmentStoreDto>();

export const initialState: AppointmentState = appointmentAdapter.getInitialState({
    appointmentsLoaded: false,

    appointmentAdded: false,

    loading: false,
    error: null
});

const toStoreDto = (appointment: AppointmentDto): AppointmentStoreDto => ({
    id: appointment.id,
    appointmentDate: appointment.appointmentDate,
    timeSlot: appointment.timeSlot.slice(0, 5),
    created_at: appointment.created_at,
    salonId: appointment.salon?.id ?? null,
    clientId: appointment.client?.id ?? null,
    salonName: appointment.salon?.name ?? 'Salon',
    clientName: appointment.client?.email ?? 'Nepoznat korisnik',
    treatmentName: appointment.treatment?.name ?? null,
    treatmentPrice: appointment.treatment?.price ?? null
});

export const appointmentReducer = createReducer(
    initialState,

    // SVI TERMINI
    on(loadAppointments, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadAppointmentsSuccess, (state, { appointments }) =>
        appointmentAdapter.setAll(appointments.map(toStoreDto), {
            ...state,
            appointmentsLoaded: true,
            loading: false
        })
    ),
    on(loadAppointmentsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),

    // ZAKAZI TERMIN
    on(createAppointment, (state) => ({
        ...state,
        appointmentAdded: false,
        loading: true,
        error: null
    })),
    on(createAppointmentSuccess, (state, { appointment, salon_id, client_id }) =>
        appointmentAdapter.upsertOne(
            { ...toStoreDto(appointment), salonId: salon_id, clientId: client_id },
            { ...state, appointmentAdded: true, loading: false }
        )
    ),
    on(createAppointmentFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),

    // OTKAZI TERMIN
    on(deleteAppointmentSuccess, (state, { id }) =>
        appointmentAdapter.removeOne(id, state)
    ),
    on(deleteAppointmentFailure, (state, { error }) => ({
        ...state,
        error: error
    }))
);