import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, filter, take, takeUntil } from 'rxjs';
import { TreatmentFormComponent } from '../../shared/components/treatment-form/treatment-form.component';
import { TreatmentListComponent } from '../../shared/components/treatment-list/treatment-list.component';
import { SalonViewDto } from '../../shared/dtos/salon-view.dto';
import { CATEGORIES } from '../../shared/local-lists/categories.list';
import { WEEK_DAYS } from '../../shared/local-lists/working-hours.list';
import { deleteTreatment, loadSalon, updateSalon } from '../../shared/store/salon/salon.actions';
import { selectSalonById, selectSalonError, selectSalonLoading } from '../../shared/store/salon/salon.selectors';

@Component({
  selector: 'app-salon-edit',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, TreatmentListComponent, TreatmentFormComponent],
  templateUrl: './salon-edit.component.html',
  styleUrl: './salon-edit.component.scss'
})
export class SalonEditComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  categories = CATEGORIES;
  weekDays = WEEK_DAYS;
  selectedDays: number[] = [];
  file: File | null = null;
  salonId = 0;

  salon$?: Observable<SalonViewDto | null>;
  loading$: Observable<boolean> = this.store.select(selectSalonLoading);
  error$: Observable<string | null> = this.store.select(selectSalonError);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: [CATEGORIES[0].value, [Validators.required]],
    city: ['', [Validators.required]],
    tags: [''],
    openTime: ['09:00', [Validators.required]],
    closeTime: ['17:00', [Validators.required]]
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.salonId = Number(this.route.snapshot.paramMap.get('id'));
    const salon$ = this.store.select(selectSalonById(this.salonId));
    this.salon$ = salon$;
    this.store.dispatch(loadSalon({ id: this.salonId }));

    // formu popuni samo prvi put, da kasnije osvezavanje cenovnika ne brise unos
    salon$.pipe(
      filter((salon): salon is SalonViewDto => salon !== null),
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(salon => {
      this.form.patchValue({
        name: salon.name,
        description: salon.description,
        category: salon.category,
        city: salon.city ?? '',
        tags: salon.tags ?? '',
        openTime: salon.openTime,
        closeTime: salon.closeTime
      });
      this.selectedDays = (salon.workingDays ?? '').split(',').filter(Boolean).map(Number);
    });
  }

  get hoursValid(): boolean {
    const { openTime, closeTime } = this.form.getRawValue();
    return openTime < closeTime;
  }

  get canSave(): boolean {
    return this.form.valid && this.hoursValid && this.selectedDays.length > 0;
  }

  isDaySelected(day: number): boolean {
    return this.selectedDays.includes(day);
  }

  toggleDay(day: number): void {
    this.selectedDays = this.isDaySelected(day)
      ? this.selectedDays.filter(selected => selected !== day)
      : [...this.selectedDays, day];
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }

  removeTreatment(treatmentId: number): void {
    this.store.dispatch(deleteTreatment({ treatment_id: treatmentId, salon_id: this.salonId }));
  }

  submit(): void {
    if (!this.canSave) {
      return;
    }
    const formData = new FormData();
    Object.entries(this.form.getRawValue()).forEach(([key, value]) => formData.append(key, value));
    formData.append('workingDays', [...this.selectedDays].sort((a, b) => a - b).join(','));
    if (this.file) {
      formData.append('image', this.file);
    }
    this.store.dispatch(updateSalon({ id: this.salonId, salonData: formData }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}