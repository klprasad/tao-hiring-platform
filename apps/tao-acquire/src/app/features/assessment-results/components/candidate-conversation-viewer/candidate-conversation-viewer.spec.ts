import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateConversationViewer } from './candidate-conversation-viewer';

describe('CandidateConversationViewer', () => {
  let component: CandidateConversationViewer;
  let fixture: ComponentFixture<CandidateConversationViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateConversationViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateConversationViewer);
    fixture.componentRef.setInput('response', {
      assessmentSessionId: 'session-1',
      roundId: 'round-1',
      questionId: 'question-1',
      messages: [
        { role: 'assistant', content: 'Tell me about your approach.' },
        { role: 'candidate', content: 'I would use dependency injection.' },
      ],
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
