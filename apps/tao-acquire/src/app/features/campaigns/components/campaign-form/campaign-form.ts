import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TaoButtonComponent, TaoCardComponent, TaoInputComponent } from '@tao/ui';

import { TaoValidators } from '@tao/utils';
import { CampaignCreateRequest } from '../../models/campaign.models';

@Component({
  imports: [ReactiveFormsModule, TaoCardComponent, TaoInputComponent, TaoButtonComponent],
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

    referenceNumber: ['', [Validators.required, Validators.maxLength(100)]],

    hiringManagerId: ['', Validators.required],

    openings: [null, [Validators.required, TaoValidators.numeric()]],

    recruiterId: ['', Validators.required],
  });

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
      name: value.campaignName.trim(),
      organizationId: '019FA8F7-E474-722F-B476-C07A63658297',
      referenceNumber: value.referenceNumber.trim(),
      recruiterId: value.recruiterId.trim(),
      hiringManagerId: value.hiringManagerId.trim() ?? '019FA8F7-E53A-76F6-A7E1-5F7096B2CCDF',
      numberOfOpenings: value.openings ?? 0,
    };

    this.submitted.emit(request);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
