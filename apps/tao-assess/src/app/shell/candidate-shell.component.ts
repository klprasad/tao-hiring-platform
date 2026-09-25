import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'tao-candidate-shell',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './candidate-shell.component.html',
  styleUrl: './candidate-shell.component.scss',
})
export class CandidateShellComponent {}
