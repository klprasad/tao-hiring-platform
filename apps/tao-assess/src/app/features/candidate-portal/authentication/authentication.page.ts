import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';

@Component({
  selector: 'tao-authentication',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './authentication.page.html',
  styleUrl: './authentication.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  continue(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.assessmentNavigationService.landing();
  }
}
