import { UserDto } from './user.dto';

export interface ReviewDto {
  id: number;
  rate: number;
  comment: string;
  created_at: string;
  user?: UserDto;
}