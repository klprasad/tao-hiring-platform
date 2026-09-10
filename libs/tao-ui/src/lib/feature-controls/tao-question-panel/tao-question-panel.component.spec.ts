import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoQuestionPanelComponent } from './tao-question-panel.component';

describe('TaoQuestionPanelComponent', () => {
  let fixture: ComponentFixture<TaoQuestionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoQuestionPanelComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoQuestionPanelComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoQuestionPanelComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
