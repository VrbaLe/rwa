import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreatmentDto } from '../../dtos/treatment.dto';

@Component({
  selector: 'app-treatment-list',
  standalone: true,
  templateUrl: './treatment-list.component.html',
  styleUrl: './treatment-list.component.scss'
})
export class TreatmentListComponent {
  @Input() treatments: TreatmentDto[] = [];
  @Input() editable = false;
  @Output() remove = new EventEmitter<number>();
}