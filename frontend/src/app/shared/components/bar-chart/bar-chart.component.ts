import { Component, Input, OnChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface BarItem {
  label: string;
  value: number;
}

interface Bar extends BarItem {
  percent: number;
  showLabel: boolean;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnChanges {
  @Input() items: BarItem[] = [];
  @Input() unit = 'RSD';

  bars: Bar[] = [];
  max = 0;

  ngOnChanges(): void {
    this.max = this.items.reduce((highest, item) => Math.max(highest, item.value), 0);
    const step = Math.max(1, Math.ceil(this.items.length / 8));

    this.bars = this.items.map((item, index) => ({
      ...item,
      percent: this.max ? (item.value / this.max) * 100 : 0,
      showLabel: index % step === 0
    }));
  }
}