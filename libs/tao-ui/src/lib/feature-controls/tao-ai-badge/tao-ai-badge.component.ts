import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-ai-badge',
  templateUrl: './tao-ai-badge.component.html',
  styleUrl: './tao-ai-badge.component.scss',
})
export class TaoAiBadgeComponent {
  readonly label = input('AI assisted');
}
