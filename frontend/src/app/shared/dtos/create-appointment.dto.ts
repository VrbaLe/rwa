export interface CreateAppointmentDto {
  client_id: number;
  salon_id: number;
  timeSlot: string;        
  appointmentDate: string; 
  treatment_id?: number;
}