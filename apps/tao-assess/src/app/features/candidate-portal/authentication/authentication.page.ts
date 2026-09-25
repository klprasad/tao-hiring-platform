import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  continue(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Temporary navigation for the mock flow.
    this.router.navigate(['/access', 'demo', 'landing']);
  }
}
