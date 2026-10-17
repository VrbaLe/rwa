export interface CreateAppointmentDto {
  clientId: number;
  salonId: number;
  appointmentDate: string; 
  timeSlot: string;       
}