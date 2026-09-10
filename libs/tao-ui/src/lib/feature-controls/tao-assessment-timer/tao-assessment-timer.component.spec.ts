import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoAssessmentTimerComponent } from './tao-assessment-timer.component';

describe('TaoAssessmentTimerComponent', () => {
  let fixture: ComponentFixture<TaoAssessmentTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoAssessmentTimerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoAssessmentTimerComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoAssessmentTimerComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
