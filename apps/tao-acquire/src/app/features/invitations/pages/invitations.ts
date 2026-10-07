import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';

import { TaoButtonComponent, TaoTextareaComponent } from '@tao/ui';

import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@tao/core';

import { InvitationsService } from '../data-access/invitations.service';

@Component({
  selector: 'tao-invitations',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, TaoButtonComponent, TaoTextareaComponent],
  templateUrl: './invitations.html',
  styleUrl: './invitations.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Invitations {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly invitationsService = inject(InvitationsService);
  private readonly toaster = inject(ToasterService);

  /**
   * Campaign identifier.
   */
  readonly campaignId = this.resolveCampaignId();

  /**
   * Maximum email body length.
   */
  readonly maxLength = 5000;

  /**
   * Sending state.
   */
  readonly sending = signal(false);

  /**
   * Email form.
   */
  readonly form = this.fb.nonNullable.group({
    emailBody: ['', [Validators.required, Validators.maxLength(this.maxLength)]],
  });

  sendInvitation(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const emailBody = this.form.controls.emailBody.value.trim();

    if (!emailBody) {
      this.form.controls.emailBody.setValue('');
      this.form.controls.emailBody.markAsTouched();

      this.toaster.error('Please enter an email message.');

      return;
    }

    this.sending.set(true);
    this.invitationsService.sendInvitations(this.campaignId).subscribe({
      next: () => {
        this.sending.set(false);

        this.toaster.success('Email invitation sent successfully.');
      },

      error: (error) => {
        this.sending.set(false);

        this.toaster.error(
          error?.error?.detail ?? 'Unable to send the email invitation. Please try again.',
        );
      },
    });
  }

  private resolveCampaignId(): string {
    return (
      this.route.snapshot.paramMap.get('campaignId') ??
      this.route.parent?.snapshot.paramMap.get('campaignId') ??
      this.route.snapshot.queryParamMap.get('campaignId') ??
      ''
    );
  }
}
