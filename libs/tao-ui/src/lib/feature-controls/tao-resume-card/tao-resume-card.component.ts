import { Component, input } from '@angular/core';
import { TaoButtonComponent } from '../../native-controls/tao-button/tao-button.component';
@Component({
  selector: 'tao-resume-card',
  imports: [TaoButtonComponent],
  templateUrl: './tao-resume-card.component.html',
  styleUrl: './tao-resume-card.component.scss',
})
export class TaoResumeCardComponent {
  readonly candidate = input('Candidate name');
  readonly role = input('Role');
  readonly summary = input('Resume summary');
}
