import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-resume-card',
  templateUrl: './tao-resume-card.component.html',
  styleUrl: './tao-resume-card.component.scss',
})
export class TaoResumeCardComponent {
  readonly candidate = input('Candidate name');
  readonly role = input('Role');
  readonly summary = input('Resume summary');
}
