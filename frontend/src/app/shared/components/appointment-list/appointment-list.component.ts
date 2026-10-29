import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppointmentViewDto } from '../../dtos/appointment-view.dto';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss'
})
export class AppointmentListComponent {
  @Input() appointments: AppointmentViewDto[] = [];
  @Input() canCancel = false;
  @Output() cancelAppointment = new EventEmitter<number>();
  @Input() showClient = false;
}