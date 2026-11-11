import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SalonViewDto } from '../../dtos/salon-view.dto';
import { CATEGORIES } from '../../local-lists/categories.list';

@Component({
  selector: 'app-salon-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './salon-card.component.html',
  styleUrl: './salon-card.component.scss'
})
export class SalonCardComponent {
  @Input({ required: true }) salon!: SalonViewDto;
  @Input() showFavorite = false;
  @Input() deletable = false;
  @Input() editable = false;
  @Output() selected = new EventEmitter<number>();
  @Output() favoriteToggle = new EventEmitter<{ id: number; favorite: boolean }>();
  @Output() remove = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();


  get categoryLabel(): string {
    return CATEGORIES.find(category => category.value === this.salon.category)?.label ?? this.salon.category;
  }

  onClick(): void {
    this.selected.emit(this.salon.id);
  }
   
  onFavorite(event: Event): void {
    event.stopPropagation();
    this.favoriteToggle.emit({ id: this.salon.id, favorite: !this.salon.isFavorite });
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit(this.salon.id);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.salon.id);
  }
}