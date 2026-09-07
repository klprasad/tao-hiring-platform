import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-interviewer-message',
  templateUrl: './tao-interviewer-message.component.html',
  styleUrl: './tao-interviewer-message.component.scss',
})
export class TaoInterviewerMessageComponent {
  readonly message = input('');
  readonly sender = input('TAO interviewer');
}
