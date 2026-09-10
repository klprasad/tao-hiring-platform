import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoAiStateComponent } from './tao-ai-state.component';

describe('TaoAiStateComponent', () => {
  let fixture: ComponentFixture<TaoAiStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoAiStateComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoAiStateComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoAiStateComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
