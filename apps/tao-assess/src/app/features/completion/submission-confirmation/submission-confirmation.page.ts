import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'tao-submission-confirmation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './submission-confirmation.page.html',
  styleUrl: './submission-confirmation.page.scss',
})
export class SubmissionConfirmationPage {}
