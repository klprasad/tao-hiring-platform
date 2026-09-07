import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-ai-status',
  templateUrl: './tao-ai-status.component.html',
  styleUrl: './tao-ai-status.component.scss',
})
export class TaoAiStatusComponent {
  readonly status = input<'generating' | 'generated' | 'failed'>('generated');
}
