import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent {
    @Input() value = 0;
    @Input() interactive = false;
    @Output() valueChange = new EventEmitter<number>();

    stars = [1, 2, 3, 4, 5];

    get rounded(): number {
      return Math.round(this.value);
    }

    select(star: number): void {
      if (this.interactive) {
        this.valueChange.emit(star);
      }
    }
}
