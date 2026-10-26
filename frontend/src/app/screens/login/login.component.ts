import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { login } from '../../shared/store/auth/auth.actions';
import { selectAuthError} from '../../shared/store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  error$ = this.store.select(selectAuthError);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(login(this.form.getRawValue()));
  }
}