import { UserShortDto } from './user.dto';
import { SalonInfoDto } from './salon-info.dto';

export interface OwnerDto {
  id: number;
  firstName: string;
  lastName: string;
  about?: string;
  picture?: string;
  instagram?: string;
  linkedin?: string;
  salons?: SalonInfoDto;
}