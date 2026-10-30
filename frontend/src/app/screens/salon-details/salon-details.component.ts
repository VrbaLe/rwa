import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { AppointmentFormComponent } from '../../shared/components/appointment-form/appointment-form.component';
import { ReviewFormComponent } from '../../shared/components/review-form/review-form.component';
import { ReviewListComponent } from '../../shared/components/review-list/review-list.component';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { SalonViewDto } from '../../shared/dtos/salon-view.dto';
import { CATEGORIES } from '../../shared/local-lists/categories.list';
import { loadAppointments } from '../../shared/store/appointment/appointment.actions';
import { deleteReview, loadSalon } from '../../shared/store/salon/salon.actions';
import { selectSalonById } from '../../shared/store/salon/salon.selectors';
import { selectIsLoggedIn, selectUserId } from '../../shared/store/user/user.selectors';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-salon-details',
  standalone: true,
  imports: [
    AsyncPipe,
    DecimalPipe,
    RouterLink,
    StarRatingComponent,
    ReviewListComponent,
    ReviewFormComponent,
    AppointmentFormComponent
  ],
  templateUrl: './salon-details.component.html',
  styleUrl: './salon-details.component.scss'
})
export class SalonDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  salonId = 0;
  salon$?: Observable<SalonViewDto | null>;

  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  userId$ = this.store.select(selectUserId);

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      takeUntil(this.destroy$)
    ).subscribe(id => {
      this.salonId = id;
      this.salon$ = this.store.select(selectSalonById(id));
      this.store.dispatch(loadSalon({ id }));
      this.store.dispatch(loadAppointments());
    });
  }

  categoryLabel(value: string): string {
    return CATEGORIES.find(category => category.value === value)?.label ?? value;
  }

  removeReview(reviewId: number): void {
    this.store.dispatch(deleteReview({ review_id: reviewId, salon_id: this.salonId }));
  }

  getMapUrl(address: string, city?: string): SafeResourceUrl {
    const location = [address, city].filter(Boolean).join(', ');
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}