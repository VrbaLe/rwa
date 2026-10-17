import { SalonInfoDto } from './salon-info.dto';
import { UserShortDto } from './user.dto';

export interface AppointmentDto {
  id: number;
  appointmentDate: string; 
  timeSlot: string;        
  created_at: string;
  salon?: SalonInfoDto;
  client?: UserShortDto;
}