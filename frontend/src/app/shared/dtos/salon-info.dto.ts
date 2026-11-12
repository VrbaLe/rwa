import { OwnerDto } from './owner.dto';
import { ReviewDto } from './review.dto';
import { TreatmentDto } from './treatment.dto';

export interface SalonInfoDto {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  city?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  tags?: string;
  created_at: string;
  owner: OwnerDto;
  reviews?: ReviewDto[];
  avgRating?: number;
  reviewCount?: number;
  openTime: string;
  closeTime: string;
  workingDays: string;
  treatments: TreatmentDto[];
}