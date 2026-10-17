import { ReviewDto } from './review.dto';
import { SalonInfoDto } from './salon-info.dto';

export type SalonStoreDto = Omit<
  SalonInfoDto,
  'owner' | 'reviews' | 'avgRating' | 'reviewCount'
> & {
  ownerId: number;
  reviews: ReviewDto[];
};