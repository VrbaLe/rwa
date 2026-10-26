import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SalonViewDto } from '../../dtos/salon-view.dto';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-salon-card',
  standalone: true,
  imports: [DecimalPipe, StarRatingComponent],
  templateUrl: './salon-card.component.html',
  styleUrl: './salon-card.component.scss'
})
export class SalonCardComponent {
  @Input({ required: true }) salon!: SalonViewDto;
  @Input() deletable = false;
  @Output() selected = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  onClick(): void {
    this.selected.emit(this.salon.id);
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit(this.salon.id);
  }
}
