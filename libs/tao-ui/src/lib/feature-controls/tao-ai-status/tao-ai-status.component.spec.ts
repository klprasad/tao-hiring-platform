import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoAiStatusComponent } from './tao-ai-status.component';

describe('TaoAiStatusComponent', () => {
  let fixture: ComponentFixture<TaoAiStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoAiStatusComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoAiStatusComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoAiStatusComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
