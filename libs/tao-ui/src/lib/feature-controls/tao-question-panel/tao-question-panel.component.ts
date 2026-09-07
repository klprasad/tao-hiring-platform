import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-question-panel',
  templateUrl: './tao-question-panel.component.html',
  styleUrl: './tao-question-panel.component.scss',
})
export class TaoQuestionPanelComponent {
  readonly number = input(1);
  readonly total = input(1);
  readonly question = input('Question text');
  readonly required = input(false);
}
