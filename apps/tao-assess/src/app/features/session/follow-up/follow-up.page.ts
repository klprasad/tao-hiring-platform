import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'tao-follow-up',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './follow-up.page.html',
  styleUrl: './follow-up.page.scss',
})
export class FollowUpPage {
  private readonly router = inject(Router);
  response = '';
  continue(): void {
    this.router.navigate(['/session/demo-session/question']);
  }
}
