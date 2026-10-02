import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaoLoadingStateComponent, TaoThemeSwitcherComponent } from '@tao/ui';
import { HttpLoadingService } from '@tao/core';

@Component({
  selector: 'tao-candidate-shell',
  standalone: true,
  imports: [RouterOutlet, TaoLoadingStateComponent, TaoThemeSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './candidate-shell.component.html',
  styleUrl: './candidate-shell.component.scss',
})
export class CandidateShellComponent {
  protected loadingService = inject(HttpLoadingService);
  readonly loading = this.loadingService.isLoading;
}
