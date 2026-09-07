import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-ai-state',
  templateUrl: './tao-ai-state.component.html',
  styleUrl: './tao-ai-state.component.scss',
})
export class TaoAiStateComponent {
  readonly state = input<'idle' | 'generating' | 'ready' | 'failed'>('idle');
  readonly label = input('AI state');
}
