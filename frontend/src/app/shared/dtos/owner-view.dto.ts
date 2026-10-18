import { OwnerDto } from './owner.dto';
import { SalonViewDto } from './salon-view.dto';

export type OwnerViewDto = Omit<OwnerDto, 'salons'> & {
  salons: SalonViewDto[];
};