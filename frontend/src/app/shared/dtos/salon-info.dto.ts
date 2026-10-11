import { OwnerDto } from './owner.dto';
import { ReviewDto } from './review.dto';

export interface SalonInfoDto {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  city?: string;
  tags?: string;
  created_at: string;
  owner: OwnerDto;
  reviews?: ReviewDto[];
  avgRating?: number;
  reviewCount?: number;
}