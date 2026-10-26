import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReviewDto } from '../../dtos/review.dto';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [DatePipe, StarRatingComponent],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss'
})
export class ReviewListComponent {
  @Input() reviews: ReviewDto[] = [];
  @Input() currentUserId: number | null = null;
  @Output() remove = new EventEmitter<number>();

  isMine(review: ReviewDto): boolean {
    return this.currentUserId !== null && review.user?.id === this.currentUserId;
  }
}