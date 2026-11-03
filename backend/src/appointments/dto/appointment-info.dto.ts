export class AppointmentInfo {
    id: number;
    appointmentDate: string;
    timeSlot: string;
    created_at: Date;
    salon: { id: number; name: string };
    client: { id: number; email?: string };
    treatment: { id: number; name: string; price: number } | null;
}