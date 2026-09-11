import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ResumeProcess } from './resume-process';

describe('ResumeProcess', () => {
  let fixture: ComponentFixture<ResumeProcess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeProcess],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ResumeProcess);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(ResumeProcess);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
