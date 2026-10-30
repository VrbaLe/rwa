import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, of, startWith, merge, filter, switchMap, take, takeUntil, defer } from 'rxjs';
import { TIME_SLOTS } from '../../local-lists/time-slots.list';
import { createAppointment } from '../../store/appointment/appointment.actions';
import {
  selectAppointmentAdded,
  selectAppointmentsError,
  selectAppointmentsLoading,
  selectBookedSlots
} from '../../store/appointment/appointment.selectors';
import { selectUserId } from '../../store/user/user.selectors';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent implements OnInit, OnDestroy {
  @Input({ required: true }) salonId!: number;

  private destroy$ = new Subject<void>();

  today = new Date().toISOString().slice(0, 10);
  slots = TIME_SLOTS;
  submitted = false;

  added$: Observable<boolean> = this.store.select(selectAppointmentAdded);
  loading$: Observable<boolean> = this.store.select(selectAppointmentsLoading);
  error$: Observable<string | null> = this.store.select(selectAppointmentsError);
  bookedSlots$!: Observable<string[]>;


  form = this.fb.nonNullable.group({
    appointmentDate: ['', [Validators.required]],
    timeSlot: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    const dateControl = this.form.controls.appointmentDate;

   this.bookedSlots$ = defer(() =>
  dateControl.valueChanges.pipe(
    startWith(dateControl.value),
    switchMap(date =>
      date
        ? this.store.select(selectBookedSlots(this.salonId, date))
        : of([] as string[])
    ),
    takeUntil(this.destroy$)
  )
);
//     this.bookedSlots$.pipe(
//   takeUntil(this.destroy$)
// ).subscribe((slots: string[]) => {
//   console.log('SLOTOVI:', this.slots);
// console.log('POREĐENJE:', this.slots.map(slot => ({
//   slot,
//   zauzet: slots.includes(slot)
// })));
// });

    // // promena datuma ponistava izabrano vreme
    // dateControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
    //   this.form.controls.timeSlot.setValue('');
    // });

    // izabrano vreme se brise kad se promeni datum ili kad se termin uspesno zakaze
    merge(
      dateControl.valueChanges,
      this.added$.pipe(filter(added => added))
    ).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.form.controls.timeSlot.setValue('');
    });
  }

  selectSlot(slot: string): void {
    this.form.controls.timeSlot.setValue(slot);
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.store.select(selectUserId).pipe(take(1)).subscribe(userId => {
      if (userId === null) {
        return;
      }
      const { appointmentDate, timeSlot } = this.form.getRawValue();
      this.submitted = true;
      this.store.dispatch(createAppointment({
        appointment: {
          client_id: userId,
          salon_id: this.salonId,
          appointmentDate,
          timeSlot
        }
      }));
    });
  }

  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}