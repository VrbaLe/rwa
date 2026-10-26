import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { addReview } from '../../store/salon/salon.actions';
import { selectSalonError } from '../../store/salon/salon.selectors';
import { selectUserId } from '../../store/user/user.selectors';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, StarRatingComponent],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent {
  @Input({ required: true }) salonId!: number;

  error$ = this.store.select(selectSalonError);

  form = this.fb.nonNullable.group({
    rate: [0, [Validators.min(1)]],
    comment: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  setRate(rate: number): void {
    this.form.controls.rate.setValue(rate);
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.store.select(selectUserId).pipe(take(1)).subscribe(userId => {
      if (userId === null) {
        return;
      }
      const { rate, comment } = this.form.getRawValue();
      this.store.dispatch(addReview({
        review: { user_id: userId, salon_id: this.salonId, rate, comment }
      }));
      this.form.reset({ rate: 0, comment: '' });
    });
  }
}