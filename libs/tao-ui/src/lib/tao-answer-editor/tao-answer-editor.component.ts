import { Component, input, output } from '@angular/core';

@Component({
  selector: 'tao-answer-editor',
  templateUrl: './tao-answer-editor.component.html',
  styleUrl: './tao-answer-editor.component.scss',
})
export class TaoAnswerEditorComponent {
  readonly value = input('');
  readonly placeholder = input('Write your answer...');
  readonly valueChange = output<string>();
}
