import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  TaoButtonComponent,
  TaoCardComponent,
  TaoInputComponent,
  TaoSelectComponent,
  TaoTextareaComponent,
} from '@tao/ui';

import { JobProfileFormValue, JobProfileVm } from '../../models/job-profile.vm';

@Component({
  selector: 'tao-job-profile-form',
  imports: [ReactiveFormsModule, TaoButtonComponent, TaoCardComponent, TaoInputComponent, TaoSelectComponent, TaoTextareaComponent],
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
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    department: ['', Validators.required],
    location: ['', Validators.required],
    employmentType: ['', Validators.required],
    experienceLevel: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(5000)]],
    responsibilities: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(5000)]],
    requiredSkills: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(2000)]],
  });

  readonly departmentOptions = ['engineering', 'product', 'design', 'sales', 'marketing', 'quality-engineering'];
  readonly employmentTypeOptions = ['full-time', 'part-time', 'contract', 'internship'];
  readonly experienceLevelOptions = ['entry-level', 'mid-level', 'senior', 'lead', 'executive'];

  constructor() {
    effect(() => {
      const profile = this.profile();

      if (profile) {
        this.form.patchValue(profile);
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

    this.submitted.emit(this.form.getRawValue());
  }

  cancel(): void {
    this.cancelled.emit();
  }
}