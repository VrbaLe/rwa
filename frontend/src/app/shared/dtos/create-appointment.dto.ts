export interface CreateAppointmentDto {
  salonId: number;
  appointmentDate: string; // 'YYYY-MM-DD'
  timeSlot: string;        // 'HH:mm'
}