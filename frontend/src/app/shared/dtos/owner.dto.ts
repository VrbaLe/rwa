import { UserDto } from './user.dto';

export interface OwnerDto {
  id: number;
  firstName: string;
  lastName: string;
  about?: string;
  picture?: string;
  instagram?: string;
  linkedin?: string;
  user?: UserDto;
}