import { AppointmentStoreDto } from './appointment-store.dto';

export interface AppointmentViewDto extends AppointmentStoreDto {
  salonName: string;
}