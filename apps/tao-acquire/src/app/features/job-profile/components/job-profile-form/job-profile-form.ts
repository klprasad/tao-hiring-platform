import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TaoButtonComponent, TaoCardComponent, TaoTextareaComponent } from '@tao/ui';

import { JobProfileFormValue, JobProfileVm } from '../../models/job-profile.vm';

@Component({
  selector: 'tao-job-profile-form',
  imports: [ReactiveFormsModule, TaoButtonComponent, TaoCardComponent, TaoTextareaComponent],
  templateUrl: './job-profile-form.html',
  styleUrl: './job-profile-form.scss',
})
export class JobProfileFormComponent {
  readonly profile = input<JobProfileVm>();
  readonly submitted = output<JobProfileFormValue>();
  readonly cancelled = output<void>();
  readonly showValidationErrors = signal(false);

  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    description: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(5000)]],
  });
  constructor() {
    effect(() => {
      const profile = this.profile();

      if (profile) {
        this.form.patchValue({ description: profile.originalJobDescription });
      }
    });
  }

  submit(): void {
    this.showValidationErrors.set(true);
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }
    const request: JobProfileFormValue = {
      description: this.form.getRawValue().description.trim(),
    };
    this.submitted.emit(request);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
