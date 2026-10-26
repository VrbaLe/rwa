import { createSelector } from '@ngrx/store';
import { selectSalonViews } from '../salon/salon.selectors';
import { selectAppointmentViews } from '../appointment/appointment.selectors';
import { selectMySalons } from './user-view.selectors';
import { selectUserId } from './user.selectors';
import { MyReviewViewDto } from '../../dtos/my-review-view.dto';

export const selectMyReviews = createSelector(
  selectSalonViews,
  selectUserId,
  (salons, userId): MyReviewViewDto[] =>
    userId === null
      ? []
      : salons.flatMap((salon) =>
          salon.reviews
            .filter((review) => review.user?.id === userId)
            .map((review) => ({ ...review, salonId: salon.id, salonName: salon.name })),
        ),
);

export const selectOwnerAppointments = createSelector(
  selectAppointmentViews,
  selectMySalons,
  (appointments, salons) => {
    const salonIds = new Set(salons.map((salon) => salon.id));
    return appointments.filter(
      (appointment) => appointment.salonId !== null && salonIds.has(appointment.salonId),
    );
  },
);