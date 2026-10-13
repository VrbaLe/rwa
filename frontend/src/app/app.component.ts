import { Component,OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalonService } from './shared/services/salon/salon.service'


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  title = 'frontend';
  private salonService = inject(SalonService);

  ngOnInit() {
    this.salonService.loadSalons().subscribe((salons) => console.log(salons));
  }
}
