import { SalonInfoDto } from './salon-info.dto';
import { UserDto } from './user.dto';

export interface AppointmentDto {
  id: number;
  appointmentDate: string; 
  timeSlot: string;        
  created_at: string;
  salon?: SalonInfoDto;
  client?: UserDto;
}