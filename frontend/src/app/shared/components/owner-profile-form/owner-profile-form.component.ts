import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OwnerDto } from '../../dtos/owner.dto';

@Component({
  selector: 'app-owner-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './owner-profile-form.component.html',
  styleUrl: './owner-profile-form.component.scss'
})
export class OwnerProfileFormComponent implements OnChanges {
  @Input() owner: OwnerDto | null = null;
  @Output() save = new EventEmitter<FormData>();

  newPicture: File | null = null;
  saving = false;

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    about: [''],
    instagram: [''],
    linkedin: ['']
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    if (this.owner) {
      this.form.patchValue({
        firstName: this.owner.firstName,
        lastName: this.owner.lastName,
        about: this.owner.about ?? '',
        instagram: this.owner.instagram ?? '',
        linkedin: this.owner.linkedin ?? ''
      });
    }
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newPicture = input.files?.[0] ?? null;
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;

    const formData = new FormData();
    Object.entries(this.form.getRawValue()).forEach(([key, value]) => formData.append(key, value));

    const picture = this.newPicture ?? (await this.loadCurrentPicture());
    if (picture) {
      formData.append('picture', picture);
    }

    this.save.emit(formData);
    this.saving = false;
  }

  private loadCurrentPicture(): Promise<File | null> {
    if (!this.owner?.picture) {
      return Promise.resolve(null);
    }
    return fetch(this.owner.picture)
      .then(response => (response.ok ? response.blob() : null))
      .then(blob => (blob ? new File([blob], 'picture.jpg', { type: blob.type }) : null))
      .catch(() => null);
  }
}