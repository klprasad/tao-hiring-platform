import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
@Component({
  selector: 'tao-secure-access',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './secure-access.page.html',
  styleUrl: './secure-access.page.scss',
})
export class SecureAccessPage {
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);
  email = '';
  continue(): void {
    this.assessmentNavigationService.authentication();
  }
}
