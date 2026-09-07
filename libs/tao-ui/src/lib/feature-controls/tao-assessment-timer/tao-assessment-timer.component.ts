import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-assessment-timer',
  templateUrl: './tao-assessment-timer.component.html',
  styleUrl: './tao-assessment-timer.component.scss',
})
export class TaoAssessmentTimerComponent {
  readonly remaining = input('45:00');
  readonly label = input('Time remaining');
}
