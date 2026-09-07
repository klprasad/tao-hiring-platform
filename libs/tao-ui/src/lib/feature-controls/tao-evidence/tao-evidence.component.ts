import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-evidence',
  templateUrl: './tao-evidence.component.html',
  styleUrl: './tao-evidence.component.scss',
})
export class TaoEvidenceComponent {
  readonly title = input('Evidence');
  readonly quote = input('');
  readonly source = input('');
}
