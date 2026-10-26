import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { AppointmentListComponent } from '../../shared/components/appointment-list/appointment-list.component';
import { OwnerProfileFormComponent } from '../../shared/components/owner-profile-form/owner-profile-form.component';
import { SalonCardComponent } from '../../shared/components/salon-card/salon-card.component';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { MyReviewViewDto } from '../../shared/dtos/my-review-view.dto';
import { deleteAppointment, loadAppointments } from '../../shared/store/appointment/appointment.actions';
import { selectMyAppointments } from '../../shared/store/appointment/appointment.selectors';
import { updateOwner } from '../../shared/store/owner/owner.actions';
import { deleteReview, deleteSalon, loadSalons } from '../../shared/store/salon/salon.actions';
import { selectSalonsLoaded } from '../../shared/store/salon/salon.selectors';
import { selectMyReviews, selectOwnerAppointments } from '../../shared/store/user/profile.selectors';
import { selectIsOwner, selectCurrentUser } from '../../shared/store/user/user.selectors';
import { selectCurrentOwner, selectMySalons } from '../../shared/store/user/user-view.selectors';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    AppointmentListComponent,
    OwnerProfileFormComponent,
    SalonCardComponent,
    StarRatingComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  tab = 'appointments';

  user$ = this.store.select(selectCurrentUser);
  isOwner$ = this.store.select(selectIsOwner);
  currentOwner$ = this.store.select(selectCurrentOwner);
  myAppointments$ = this.store.select(selectMyAppointments);
  myReviews$ = this.store.select(selectMyReviews);
  mySalons$ = this.store.select(selectMySalons);
  ownerAppointments$ = this.store.select(selectOwnerAppointments);

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadAppointments());

    this.store.select(selectSalonsLoaded).pipe(take(1)).subscribe(loaded => {
      if (!loaded) {
        this.store.dispatch(loadSalons());
      }
    });

    this.store.select(selectIsOwner).pipe(take(1)).subscribe(isOwner => {
      this.tab = isOwner ? 'salons' : 'appointments';
    });
  }

  setTab(tab: string): void {
    this.tab = tab;
  }

  openSalon(id: number): void {
    this.router.navigate(['/salon', id]);
  }

  cancelAppointment(id: number): void {
    this.store.dispatch(deleteAppointment({ id }));
  }

  removeReview(review: MyReviewViewDto): void {
    this.store.dispatch(deleteReview({ review_id: review.id, salon_id: review.salonId }));
  }

  removeSalon(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete salon?')) {
      this.store.dispatch(deleteSalon({ id }));
    }
  }

  saveProfile(ownerId: number, ownerData: FormData): void {
    this.store.dispatch(updateOwner({ id: ownerId, ownerData }));
  }
}