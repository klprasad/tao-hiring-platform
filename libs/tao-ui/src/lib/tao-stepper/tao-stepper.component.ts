import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-stepper',
  templateUrl: './tao-stepper.component.html',
  styleUrl: './tao-stepper.component.scss',
})
export class TaoStepperComponent {
  readonly steps = input<string[]>([]);
  readonly current = input(0);
}
