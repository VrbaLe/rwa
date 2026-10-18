import { OwnerDto } from './owner.dto';
import { SalonStoreDto } from './salon-store.dto';

export interface SalonViewDto extends SalonStoreDto {
  owner?: OwnerDto;
  avgRating: number;
  reviewCount: number;
}