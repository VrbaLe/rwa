import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addTreatment } from '../../store/salon/salon.actions';

@Component({
  selector: 'app-treatment-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './treatment-form.component.html',
  styleUrl: './treatment-form.component.scss'
})
export class TreatmentFormComponent {
  @Input({ required: true }) salonId!: number;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    duration: [30, [Validators.required, Validators.min(5)]]
  });

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const { name, price, duration } = this.form.getRawValue();
    this.store.dispatch(addTreatment({
      treatment: {
        salon_id: this.salonId,
        name,
        price: Number(price),
        duration: Number(duration)
      }
    }));
    this.form.reset({ name: '', price: 0, duration: 30 });
  }
}