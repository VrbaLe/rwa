import { SalonInfoDto } from './salon-info.dto';
import { UserDto } from './user.dto';

export interface AppointmentDto {
  id: number;
  appointmentDate: string; // 'YYYY-MM-DD'
  timeSlot: string;        // 'HH:mm:ss'
  created_at: string;
  salon?: SalonInfoDto;
  client?: UserDto;
}