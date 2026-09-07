import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-recovery-banner',
  templateUrl: './tao-recovery-banner.component.html',
  styleUrl: './tao-recovery-banner.component.scss',
})
export class TaoRecoveryBannerComponent {
  readonly message = input('Your session was restored.');
}
