export interface AppointmentStoreDto {
  id: number;
  appointmentDate: string;
  timeSlot: string;        
  created_at: string;
  salonId: number | null;
  clientId: number | null;
}