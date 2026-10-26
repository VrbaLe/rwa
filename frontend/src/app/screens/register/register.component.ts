import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { registerOwner, registerUser } from '../../shared/store/auth/auth.actions';
import { selectAuthError } from '../../shared/store/auth/auth.selectors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  error$ = this.store.select(selectAuthError);

  form = this.fb.nonNullable.group({
    accountType: ['user' as 'user' | 'owner'],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    name: [''],
    surname: [''],
    instagram: ['']
  });

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  get isOwner(): boolean {
    return this.form.controls.accountType.value === 'owner';
  }

  get canSubmit(): boolean {
    const { name, surname } = this.form.getRawValue();
    return this.form.valid && (!this.isOwner || (!!name && !!surname));
  }

  submit(): void {
    if (!this.canSubmit) {
      return;
    }
    const { accountType, email, password, name, surname, instagram } = this.form.getRawValue();

    if (accountType === 'owner') {
      this.store.dispatch(registerOwner({ email, password, name, surname, instagram } ));
    } else {
      this.store.dispatch(registerUser({ email, password  }));
    }
  }
}