import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-candidate-card',
  templateUrl: './tao-candidate-card.component.html',
  styleUrl: './tao-candidate-card.component.scss',
})
export class TaoCandidateCardComponent {
  readonly name = input('Candidate name');
  readonly role = input('Role');
  readonly score = input(0);
}
