import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateCodeViewer } from './candidate-code-viewer';

describe('CandidateCodeViewer', () => {
  let component: CandidateCodeViewer;
  let fixture: ComponentFixture<CandidateCodeViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateCodeViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateCodeViewer);
    fixture.componentRef.setInput('response', {
      assessmentSessionId: 'session-1',
      roundId: 'round-1',
      questionId: 'question-1',
      code: 'return true;',
    });
    component = fixture.componentInstance;
    spyOn(component, 'ngAfterViewInit').and.resolveTo();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
