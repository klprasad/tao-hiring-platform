import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { TaoButtonComponent } from '@tao/ui';

@Component({
  imports: [MatIconModule, TaoButtonComponent],
  selector: 'tao-no-access',
  styleUrl: './no-access.scss',
  templateUrl: './no-access.html',
})
export class NoAccess {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async goToLogin(): Promise<void> {
    this.authService.signOut();
    await this.router.navigate(['/login']);
  }
}
