import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TaoCardComponent } from '@tao/ui';
import { AssessmentQuestionConversationResponse } from '../../models/assessment-result.models';

@Component({
  selector: 'tao-candidate-conversation-viewer',
  standalone: true,
  imports: [TaoCardComponent],
  templateUrl: './candidate-conversation-viewer.html',
  styleUrl: './candidate-conversation-viewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateConversationViewer {
  readonly response = input.required<AssessmentQuestionConversationResponse>();
}
