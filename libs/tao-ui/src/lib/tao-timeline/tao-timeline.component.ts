import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-timeline',
  templateUrl: './tao-timeline.component.html',
  styleUrl: './tao-timeline.component.scss',
})
export class TaoTimelineComponent {
  readonly events = input<{ title: string; detail: string; time: string }[]>([]);
}
