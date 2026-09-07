import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  TaoButtonComponent,
  TaoCardComponent,
  TaoInputComponent,
  TaoSelectComponent,
  TaoTextareaComponent,
} from '@tao/ui';

import { TaoValidators } from '@tao/utils';
import { CampaignCreateRequest } from '../../models/campaign.models';

@Component({
  imports: [
    ReactiveFormsModule,
    TaoCardComponent,
    TaoInputComponent,
    TaoSelectComponent,
    TaoTextareaComponent,
    TaoButtonComponent,
  ],
  selector: 'tao-campaign-form',
  styleUrl: './campaign-form.scss',
  templateUrl: './campaign-form.html',
})
export class CampaignFormComponent {
  readonly submitted = output<CampaignCreateRequest>();
  readonly cancelled = output<void>();
  readonly showValidationErrors = signal(false);

  private readonly fb = inject(FormBuilder);

  readonly campaignForm = this.fb.nonNullable.group({
    campaignName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        TaoValidators.alphabeticWithSpaces(),
      ],
    ],

    jobTitle: ['', [Validators.required, Validators.maxLength(100)]],

    department: ['', Validators.required],

    location: ['', Validators.required],

    employmentType: ['', Validators.required],

    jobDescription: [
      '',
      [Validators.required, Validators.minLength(50), Validators.maxLength(5000)],
    ],
  });

  readonly departmentOptions = [
    'engineering',
    'quality-engineering',
    'product',
    'design',
    'sales',
    'marketing',
    'human-resources',
  ];

  readonly employmentTypeOptions = ['full-time', 'part-time', 'contract', 'internship'];

  submit(): void {
    this.showValidationErrors.set(true);
    this.campaignForm.updateValueAndValidity();

    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      this.campaignForm.markAsDirty();
      return;
    }

    const value = this.campaignForm.getRawValue();

    const request: CampaignCreateRequest = {
      campaignName: value.campaignName.trim(),
      jobTitle: value.jobTitle.trim(),
      department: value.department,
      location: value.location.trim(),
      employmentType: value.employmentType,
      jobDescription: value.jobDescription.trim(),
    };

    this.submitted.emit(request);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
