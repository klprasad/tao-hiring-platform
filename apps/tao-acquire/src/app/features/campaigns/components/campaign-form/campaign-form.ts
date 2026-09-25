import { Component, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  TaoButtonComponent,
  TaoCardComponent,
  TaoInputComponent,
  TaoSelectComponent,
} from '@tao/ui';

import { TaoValidators } from '@tao/utils';
import { CampaignCreateRequest } from '../../models/campaign.model';
import { AuthStore } from '@tao/core';
import { CampaignService } from '../../data-access/campaign.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Users, UserRole } from '../../models/users.model';
import { catchError, of } from 'rxjs';

@Component({
  imports: [
    ReactiveFormsModule,
    TaoCardComponent,
    TaoInputComponent,
    TaoButtonComponent,
    TaoSelectComponent,
  ],
  selector: 'tao-campaign-form',
  styleUrl: './campaign-form.scss',
  templateUrl: './campaign-form.html',
})
export class CampaignFormComponent {
  readonly authStore = inject(AuthStore);
  private readonly campaignService = inject(CampaignService);
  readonly submitted = output<CampaignCreateRequest>();
  readonly cancelled = output<void>();
  readonly showValidationErrors = signal(false);
  private readonly fb = inject(FormBuilder);
  readonly users = toSignal(
    this.campaignService.getUsers().pipe(
      catchError((error) => {
        console.error('Failed to load users', error);
        return of([]);
      }),
    ),
    { initialValue: [] as Users[] },
  );
  readonly recruiters = computed(() =>
    this.users().filter((user) => user.role === UserRole.Recruiter),
  );
  readonly hiringManagers = computed(() =>
    this.users().filter((user) => user.role === UserRole.HiringManager),
  );
  protected readonly getUserLabel = (user: Users): string => `${user.firstName} ${user.lastName}`;

  protected readonly getUserValue = (user: Users): string => user.id;

  readonly campaignForm = this.fb.nonNullable.group({
    campaignName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],

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
    const currentUser = this.authStore.user();
    if (!currentUser) {
      return;
    }
    const value = this.campaignForm.getRawValue();

    const request: CampaignCreateRequest = {
      name: value.campaignName.trim(),
      organizationId: currentUser.organizationId,
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
