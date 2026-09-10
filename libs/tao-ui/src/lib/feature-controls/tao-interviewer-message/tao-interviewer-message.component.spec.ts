import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoInterviewerMessageComponent } from './tao-interviewer-message.component';

describe('TaoInterviewerMessageComponent', () => {
  let fixture: ComponentFixture<TaoInterviewerMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoInterviewerMessageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoInterviewerMessageComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoInterviewerMessageComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
