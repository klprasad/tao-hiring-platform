import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'tao-assessment-session',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="session"><router-outlet /></div>`,
  styles: [
    `
      .session {
        width: 100%;
        min-height: calc(100vh - 64px);
      }
    `,
  ],
})
export class AssessmentSessionPage {}
