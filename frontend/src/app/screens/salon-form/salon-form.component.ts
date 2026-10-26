import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CATEGORIES } from '../../shared/local-lists/categories.list';
import { addSalon } from '../../shared/store/salon/salon.actions';
import { selectCities, selectSalonError, selectSalonLoading } from '../../shared/store/salon/salon.selectors';

@Component({
  selector: 'app-salon-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './salon-form.component.html',
  styleUrl: './salon-form.component.scss'
})
export class SalonFormComponent {
  categories = CATEGORIES;
  file: File | null = null;

  cities$ = this.store.select(selectCities);
  loading$ = this.store.select(selectSalonLoading);
  error$ = this.store.select(selectSalonError);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: [CATEGORIES[0].value, [Validators.required]],
    city: ['', [Validators.required]],
    tags: ['']
  });

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }

  submit(): void {
    if (this.form.invalid || !this.file) {
      return;
    }
    const formData = new FormData();
    Object.entries(this.form.getRawValue()).forEach(([key, value]) => formData.append(key, value));
    formData.append('image', this.file);

    this.store.dispatch(addSalon({ salonData: formData }));
  }
}