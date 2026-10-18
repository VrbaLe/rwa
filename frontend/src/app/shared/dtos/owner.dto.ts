import { UserShortDto } from './user.dto';
import { SalonInfoDto } from './salon-info.dto';

export type OwnerSalonDto = Omit<SalonInfoDto, 'owner'>;

export interface OwnerDto {
  id: number;
  firstName: string;
  lastName: string;
  about?: string;
  picture?: string;
  instagram?: string;
  linkedin?: string;
  user?: UserShortDto;
  salons?: OwnerSalonDto[];
}