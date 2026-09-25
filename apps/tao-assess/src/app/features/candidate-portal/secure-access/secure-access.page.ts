import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'tao-secure-access',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './secure-access.page.html',
  styleUrl: './secure-access.page.scss',
})
export class SecureAccessPage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  email = '';
  continue(): void {
    this.router.navigate(['auth'], { relativeTo: this.route });
  }
}
