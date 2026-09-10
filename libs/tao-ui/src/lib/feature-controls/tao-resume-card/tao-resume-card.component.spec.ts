import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoResumeCardComponent } from './tao-resume-card.component';

describe('TaoResumeCardComponent', () => {
  let fixture: ComponentFixture<TaoResumeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoResumeCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoResumeCardComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoResumeCardComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
