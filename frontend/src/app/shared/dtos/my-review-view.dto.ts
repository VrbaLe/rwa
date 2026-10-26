import { ReviewDto } from './review.dto';

export interface MyReviewViewDto extends ReviewDto {
  salonId: number;
  salonName: string;
}